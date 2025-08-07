// WebSocket Manager for koH Labs Terminal
// Handles real-time communication, data streaming, and Matrix sync

import { Server as SocketServer } from 'socket.io';
import { Server } from 'http';
import { Redis } from 'ioredis';
import { CommandProcessor } from '../services/CommandProcessor';
import { DataStreamService } from '../services/DataStreamService';
import { SessionManager } from '../services/SessionManager';
import { RateLimiter } from '../middleware/RateLimiter';

export interface ConnectedClient {
  userId: string;
  sessionId: string;
  socket: any; // Socket.io socket
  permissions: number;
  dangerousModeEnabled: boolean;
  aiModeEnabled: boolean;
  subscriptions: Set<string>;
  rateLimiter: RateLimiter;
  connectedAt: Date;
  lastActivity: Date;
}

export interface WebSocketMessage {
  event: string;
  data: any;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

export class WebSocketManager {
  private io: SocketServer;
  private redis: Redis;
  private commandProcessor: CommandProcessor;
  private dataStreamService: DataStreamService;
  private sessionManager: SessionManager;
  private clients: Map<string, ConnectedClient> = new Map(); // socketId -> client
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> set of socketIds
  private subscriptions: Map<string, Set<string>> = new Map(); // topic -> set of socketIds
  
  constructor(
    server: Server,
    redis: Redis,
    commandProcessor: CommandProcessor,
    dataStreamService: DataStreamService,
    sessionManager: SessionManager
  ) {
    this.redis = redis;
    this.commandProcessor = commandProcessor;
    this.dataStreamService = dataStreamService;
    this.sessionManager = sessionManager;
    
    this.io = new SocketServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true
      },
      pingTimeout: 60000,
      pingInterval: 25000,
      transports: ['websocket', 'polling']
    });

    this.setupEventHandlers();
    this.startMatrixSync();
    this.startDataStreaming();
    this.startCleanupTasks();
  }

  // ============================================================================
  // CONNECTION MANAGEMENT
  // ============================================================================

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`WebSocket connection established: ${socket.id}`);

      socket.on('authenticate', async (data) => {
        await this.handleAuthentication(socket, data);
      });

      socket.on('disconnect', (reason) => {
        this.handleDisconnection(socket.id, reason);
      });

      socket.on('error', (error) => {
        console.error(`WebSocket error for ${socket.id}:`, error);
      });

      // Terminal command execution
      socket.on('terminal:command', async (data) => {
        await this.handleTerminalCommand(socket, data);
      });

      // Data subscription management
      socket.on('data:subscribe', async (data) => {
        await this.handleDataSubscription(socket, data);
      });

      socket.on('data:unsubscribe', async (data) => {
        await this.handleDataUnsubscription(socket, data);
      });

      // Matrix background sync
      socket.on('matrix:activity', async (data) => {
        await this.handleMatrixActivity(socket, data);
      });

      // AI interaction
      socket.on('ai:request', async (data) => {
        await this.handleAIRequest(socket, data);
      });

      // Heartbeat for keeping connection alive
      socket.on('ping', () => {
        socket.emit('pong', { timestamp: Date.now() });
        this.updateClientActivity(socket.id);
      });
    });
  }

  private async handleAuthentication(socket: any, data: { token: string }) {
    try {
      // Validate session token
      const session = await this.sessionManager.validateSession(data.token);
      if (!session) {
        socket.emit('auth:error', { error: 'Invalid session token' });
        socket.disconnect(true);
        return;
      }

      const user = await this.sessionManager.getUser(session.userId);
      if (!user) {
        socket.emit('auth:error', { error: 'User not found' });
        socket.disconnect(true);
        return;
      }

      // Create client record
      const client: ConnectedClient = {
        userId: user.id,
        sessionId: session.id,
        socket,
        permissions: user.permission_level,
        dangerousModeEnabled: user.dangerous_mode_enabled,
        aiModeEnabled: user.ai_mode_preference !== 'off',
        subscriptions: new Set(),
        rateLimiter: new RateLimiter({
          windowMs: 1000,
          maxRequests: 50,
          identifier: user.id
        }),
        connectedAt: new Date(),
        lastActivity: new Date()
      };

      this.clients.set(socket.id, client);
      
      // Track user sockets
      if (!this.userSockets.has(user.id)) {
        this.userSockets.set(user.id, new Set());
      }
      this.userSockets.get(user.id)!.add(socket.id);

      // Update session with WebSocket ID
      await this.sessionManager.updateSessionWebSocket(session.id, socket.id);

      // Send authentication success
      socket.emit('auth:success', {
        userId: user.id,
        username: user.username,
        permissions: user.permission_level,
        dangerousModeEnabled: user.dangerous_mode_enabled,
        aiModeEnabled: client.aiModeEnabled
      });

      // Send welcome message to terminal
      socket.emit('terminal:output', {
        type: 'system',
        content: `Welcome to koH Labs Terminal, ${user.username || 'User'}!\nType 'help' to get started.`,
        timestamp: Date.now()
      });

      console.log(`User ${user.username} authenticated on socket ${socket.id}`);

    } catch (error) {
      console.error('Authentication error:', error);
      socket.emit('auth:error', { error: 'Authentication failed' });
      socket.disconnect(true);
    }
  }

  private handleDisconnection(socketId: string, reason: string) {
    const client = this.clients.get(socketId);
    if (!client) return;

    console.log(`User ${client.userId} disconnected: ${reason}`);

    // Remove from user sockets tracking
    const userSockets = this.userSockets.get(client.userId);
    if (userSockets) {
      userSockets.delete(socketId);
      if (userSockets.size === 0) {
        this.userSockets.delete(client.userId);
      }
    }

    // Remove from all subscriptions
    client.subscriptions.forEach(topic => {
      const topicSubscribers = this.subscriptions.get(topic);
      if (topicSubscribers) {
        topicSubscribers.delete(socketId);
        if (topicSubscribers.size === 0) {
          this.subscriptions.delete(topic);
        }
      }
    });

    // Remove client record
    this.clients.delete(socketId);

    // Update session status
    this.sessionManager.updateSessionWebSocket(client.sessionId, null);
  }

  // ============================================================================
  // TERMINAL COMMAND HANDLING
  // ============================================================================

  private async handleTerminalCommand(socket: any, data: { command: string; sessionId?: string }) {
    const client = this.clients.get(socket.id);
    if (!client) {
      socket.emit('terminal:error', { error: 'Not authenticated' });
      return;
    }

    // Rate limiting
    const allowed = await client.rateLimiter.checkLimit();
    if (!allowed) {
      socket.emit('terminal:error', { error: 'Rate limit exceeded. Please slow down.' });
      return;
    }

    this.updateClientActivity(socket.id);

    try {
      // Send command acknowledgment
      socket.emit('terminal:output', {
        type: 'command',
        content: `> ${data.command}`,
        timestamp: Date.now()
      });

      // Parse and validate command
      const parsed = this.commandProcessor.parseCommand(data.command);
      
      const context = {
        user: await this.sessionManager.getUser(client.userId),
        sessionId: client.sessionId,
        websocket: socket,
        dangerousModeEnabled: client.dangerousModeEnabled,
        aiModeEnabled: client.aiModeEnabled
      };

      // Execute command
      const result = await this.commandProcessor.executeCommand(parsed, context);

      // Send result to terminal
      socket.emit('terminal:output', {
        type: result.success ? 'success' : 'error',
        content: result.output,
        timestamp: Date.now(),
        executionTime: result.executionTime,
        data: result.data
      });

      // Handle special commands that affect client state
      if (result.success && parsed.command === 'dangerous-mode') {
        client.dangerousModeEnabled = !client.dangerousModeEnabled;
        socket.emit('state:update', {
          dangerousModeEnabled: client.dangerousModeEnabled
        });
      }

      if (result.success && parsed.command === 'ai-mode') {
        client.aiModeEnabled = parsed.arguments[0] !== 'off';
        socket.emit('state:update', {
          aiModeEnabled: client.aiModeEnabled
        });
      }

    } catch (error) {
      console.error('Command execution error:', error);
      socket.emit('terminal:output', {
        type: 'error',
        content: `System error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now()
      });
    }
  }

  // ============================================================================
  // DATA SUBSCRIPTION MANAGEMENT
  // ============================================================================

  private async handleDataSubscription(socket: any, data: { topics: string[] }) {
    const client = this.clients.get(socket.id);
    if (!client) {
      socket.emit('error', { error: 'Not authenticated' });
      return;
    }

    for (const topic of data.topics) {
      // Validate subscription permissions
      if (!this.canSubscribeToTopic(client, topic)) {
        socket.emit('subscription:error', { 
          topic, 
          error: 'Insufficient permissions' 
        });
        continue;
      }

      // Add to client subscriptions
      client.subscriptions.add(topic);

      // Add to global subscription tracking
      if (!this.subscriptions.has(topic)) {
        this.subscriptions.set(topic, new Set());
      }
      this.subscriptions.get(topic)!.add(socket.id);

      // Join Socket.io room for efficient broadcasting
      socket.join(topic);

      socket.emit('subscription:success', { topic });
      console.log(`User ${client.userId} subscribed to ${topic}`);
    }

    this.updateClientActivity(socket.id);
  }

  private async handleDataUnsubscription(socket: any, data: { topics: string[] }) {
    const client = this.clients.get(socket.id);
    if (!client) return;

    for (const topic of data.topics) {
      client.subscriptions.delete(topic);
      
      const topicSubscribers = this.subscriptions.get(topic);
      if (topicSubscribers) {
        topicSubscribers.delete(socket.id);
        if (topicSubscribers.size === 0) {
          this.subscriptions.delete(topic);
        }
      }

      socket.leave(topic);
      socket.emit('unsubscription:success', { topic });
    }

    this.updateClientActivity(socket.id);
  }

  private canSubscribeToTopic(client: ConnectedClient, topic: string): boolean {
    // Define topic permissions
    const topicPermissions: Record<string, number> = {
      'price:*': 0,           // Public price data
      'market:overview': 0,   // Public market data
      'token:*': 0,          // Public token data
      'user:*': 1,           // User-specific data
      'trading:*': 2,        // Advanced trading data
      'admin:*': 3           // Admin-only data
    };

    for (const [pattern, requiredPermission] of Object.entries(topicPermissions)) {
      if (this.matchesPattern(topic, pattern)) {
        return client.permissions >= requiredPermission;
      }
    }

    return false; // Deny by default
  }

  private matchesPattern(topic: string, pattern: string): boolean {
    const regex = new RegExp(pattern.replace('*', '.*'));
    return regex.test(topic);
  }

  // ============================================================================
  // MATRIX BACKGROUND SYNC
  // ============================================================================

  private async handleMatrixActivity(socket: any, data: { activity: string; intensity?: number }) {
    const client = this.clients.get(socket.id);
    if (!client) return;

    // Broadcast matrix activity to all connected users for synchronized background
    this.io.emit('matrix:sync', {
      userId: client.userId,
      activity: data.activity,
      intensity: data.intensity || 1,
      timestamp: Date.now()
    });

    this.updateClientActivity(socket.id);
  }

  private startMatrixSync() {
    // Periodic matrix background updates
    setInterval(() => {
      if (this.clients.size > 0) {
        const matrixData = this.generateMatrixData();
        this.io.emit('matrix:update', matrixData);
      }
    }, 5000); // Update every 5 seconds
  }

  private generateMatrixData() {
    return {
      connectedUsers: this.clients.size,
      activeSubscriptions: this.subscriptions.size,
      systemLoad: Math.random(), // Would be actual system metrics
      timestamp: Date.now()
    };
  }

  // ============================================================================
  // AI REQUEST HANDLING
  // ============================================================================

  private async handleAIRequest(socket: any, data: { type: string; content: string }) {
    const client = this.clients.get(socket.id);
    if (!client || !client.aiModeEnabled) {
      socket.emit('ai:error', { error: 'AI mode not enabled' });
      return;
    }

    // Rate limiting for AI requests
    const allowed = await client.rateLimiter.checkLimit('ai', { windowMs: 5000, maxRequests: 10 });
    if (!allowed) {
      socket.emit('ai:error', { error: 'AI rate limit exceeded' });
      return;
    }

    try {
      // Handle different types of AI requests
      switch (data.type) {
        case 'command_suggestion':
          const suggestions = await this.commandProcessor.getPredictedCommands(
            { ...client, user: await this.sessionManager.getUser(client.userId) } as any,
            [data.content]
          );
          socket.emit('ai:suggestions', { suggestions });
          break;

        case 'explain':
          // Implementation would use AI service to explain data/commands
          socket.emit('ai:explanation', { 
            content: `AI explanation for: ${data.content}` 
          });
          break;

        default:
          socket.emit('ai:error', { error: 'Unknown AI request type' });
      }

    } catch (error) {
      console.error('AI request error:', error);
      socket.emit('ai:error', { 
        error: 'AI service temporarily unavailable' 
      });
    }

    this.updateClientActivity(socket.id);
  }

  // ============================================================================
  // DATA STREAMING
  // ============================================================================

  private startDataStreaming() {
    // Stream real-time data to subscribed clients
    this.dataStreamService.onPriceUpdate((priceData) => {
      const topic = `price:${priceData.token}`;
      if (this.subscriptions.has(topic)) {
        this.io.to(topic).emit('data:price_update', priceData);
      }
    });

    this.dataStreamService.onMarketUpdate((marketData) => {
      const topic = 'market:overview';
      if (this.subscriptions.has(topic)) {
        this.io.to(topic).emit('data:market_update', marketData);
      }
    });

    // Stream token events
    this.dataStreamService.onTokenEvent((tokenEvent) => {
      const topic = `token:${tokenEvent.mintAddress}`;
      if (this.subscriptions.has(topic)) {
        this.io.to(topic).emit('data:token_event', tokenEvent);
      }
    });
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private updateClientActivity(socketId: string) {
    const client = this.clients.get(socketId);
    if (client) {
      client.lastActivity = new Date();
    }
  }

  private startCleanupTasks() {
    // Clean up inactive connections
    setInterval(() => {
      const now = new Date();
      const timeout = 30 * 60 * 1000; // 30 minutes

      for (const [socketId, client] of this.clients.entries()) {
        if (now.getTime() - client.lastActivity.getTime() > timeout) {
          console.log(`Cleaning up inactive connection: ${socketId}`);
          client.socket.disconnect(true);
        }
      }
    }, 60000); // Check every minute
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  public getConnectionStats() {
    return {
      totalConnections: this.clients.size,
      uniqueUsers: this.userSockets.size,
      activeSubscriptions: this.subscriptions.size,
      uptime: process.uptime()
    };
  }

  public broadcastToUser(userId: string, event: string, data: any) {
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.forEach(socketId => {
        const client = this.clients.get(socketId);
        if (client) {
          client.socket.emit(event, data);
        }
      });
    }
  }

  public broadcastToTopic(topic: string, event: string, data: any) {
    this.io.to(topic).emit(event, data);
  }

  public disconnectUser(userId: string, reason: string = 'Admin disconnect') {
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.forEach(socketId => {
        const client = this.clients.get(socketId);
        if (client) {
          client.socket.disconnect(true);
        }
      });
    }
  }
}

export default WebSocketManager;