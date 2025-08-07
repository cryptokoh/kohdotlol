// Main Server Entry Point for koH Labs Terminal Backend
// Express.js server with WebSocket integration, middleware, and service orchestration

import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { Redis } from 'ioredis';
import dotenv from 'dotenv';

// Services
import { CommandProcessor } from './services/CommandProcessor';
import { DataStreamService } from './services/DataStreamService';
import { SessionManager } from './services/SessionManager';
import { AIService } from './services/AIService';
import { SolanaService } from './services/SolanaService';
import { DataService } from './services/DataService';
import { MonitoringService } from './services/MonitoringService';

// WebSocket Manager
import { WebSocketManager } from './websocket/WebSocketManager';

// Middleware
import { authMiddleware } from './middleware/auth';
import { validationMiddleware } from './middleware/validation';
import { loggingMiddleware } from './middleware/logging';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';
import commandRoutes from './routes/commands';
import solanaRoutes from './routes/solana';
import dataRoutes from './routes/data';
import aiRoutes from './routes/ai';
import systemRoutes from './routes/system';

// Load environment variables
dotenv.config();

class KohLabsTerminalServer {
  private app: express.Application;
  private server: any;
  private redis: Redis;
  private wsManager: WebSocketManager;
  
  // Services
  private commandProcessor: CommandProcessor;
  private dataStreamService: DataStreamService;
  private sessionManager: SessionManager;
  private aiService: AIService;
  private solanaService: SolanaService;
  private dataService: DataService;
  private monitoringService: MonitoringService;

  private readonly PORT = process.env.PORT || 3001;
  private readonly NODE_ENV = process.env.NODE_ENV || 'development';

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    
    this.initializeServices();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.setupErrorHandling();
  }

  // ============================================================================
  // SERVICE INITIALIZATION
  // ============================================================================

  private initializeServices() {
    console.log('🚀 Initializing koH Labs Terminal services...');

    // Redis connection
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      enableReadyCheck: true,
      maxRetriesPerRequest: null
    });

    // Initialize core services
    this.solanaService = new SolanaService();
    this.aiService = new AIService();
    this.dataService = new DataService(this.redis, this.solanaService);
    this.sessionManager = new SessionManager(this.redis);
    this.commandProcessor = new CommandProcessor();
    this.dataStreamService = new DataStreamService(this.redis, this.dataService);
    this.monitoringService = new MonitoringService();

    console.log('✅ Core services initialized');
  }

  // ============================================================================
  // MIDDLEWARE SETUP
  // ============================================================================

  private setupMiddleware() {
    console.log('🔧 Setting up middleware...');

    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-eval'"], // Required for dynamic imports
          connectSrc: ["'self'", "wss:", "https:"],
          imgSrc: ["'self'", "data:", "https:"],
          fontSrc: ["'self'", "https:"]
        }
      }
    }));

    // CORS configuration
    this.app.use(cors({
      origin: this.getAllowedOrigins(),
      credentials: true,
      optionsSuccessStatus: 200
    }));

    // Compression and parsing
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use(loggingMiddleware);

    // Global rate limiting
    this.app.use(rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // Limit each IP to 1000 requests per windowMs
      message: 'Too many requests from this IP, please try again later',
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req) => req.path === '/api/system/health' // Skip health checks
    }));

    // Request validation
    this.app.use(validationMiddleware);

    console.log('✅ Middleware configured');
  }

  // ============================================================================
  // ROUTE SETUP
  // ============================================================================

  private setupRoutes() {
    console.log('🛣️  Setting up API routes...');

    // Health check endpoint (public)
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: this.NODE_ENV
      });
    });

    // API routes with services injection
    this.app.use('/api/auth', authRoutes(this.sessionManager));
    this.app.use('/api/commands', commandRoutes(this.commandProcessor, this.sessionManager));
    this.app.use('/api/solana', solanaRoutes(this.solanaService, this.sessionManager));
    this.app.use('/api/data', dataRoutes(this.dataService, this.sessionManager));
    this.app.use('/api/ai', aiRoutes(this.aiService, this.sessionManager));
    this.app.use('/api/system', systemRoutes(this.monitoringService));

    // Static file serving for development
    if (this.NODE_ENV === 'development') {
      this.app.use(express.static('public'));
    }

    // 404 handler for API routes
    this.app.use('/api/*', (req, res) => {
      res.status(404).json({
        error: 'API endpoint not found',
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
      });
    });

    console.log('✅ API routes configured');
  }

  // ============================================================================
  // WEBSOCKET SETUP
  // ============================================================================

  private setupWebSocket() {
    console.log('🔌 Initializing WebSocket manager...');

    this.wsManager = new WebSocketManager(
      this.server,
      this.redis,
      this.commandProcessor,
      this.dataStreamService,
      this.sessionManager
    );

    console.log('✅ WebSocket manager initialized');
  }

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  private setupErrorHandling() {
    // 404 handler for non-API routes
    this.app.use((req, res) => {
      if (req.path.startsWith('/api/')) {
        return; // Already handled above
      }
      
      res.status(404).json({
        error: 'Resource not found',
        path: req.path,
        timestamp: new Date().toISOString()
      });
    });

    // Global error handler
    this.app.use(errorHandler);

    // Unhandled promise rejection
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Don't exit the process in production
      if (this.NODE_ENV === 'development') {
        process.exit(1);
      }
    });

    // Uncaught exception handler
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      // Graceful shutdown
      this.gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    // Graceful shutdown signals
    process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));
  }

  // ============================================================================
  // SERVER LIFECYCLE
  // ============================================================================

  public async start(): Promise<void> {
    try {
      // Start monitoring
      this.monitoringService.startMonitoring();

      // Start data streaming services
      await this.dataStreamService.startStreaming();

      // Start HTTP server
      this.server.listen(this.PORT, () => {
        console.log(`
🎯 koH Labs Terminal Backend Server Started

🌐 Server URL: http://localhost:${this.PORT}
🔌 WebSocket: ws://localhost:${this.PORT}
📊 Environment: ${this.NODE_ENV}
🕐 Started at: ${new Date().toISOString()}

Available Endpoints:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Health Check:    GET  /health
🔐 Authentication:  POST /api/auth/*
⚡ Commands:        POST /api/commands/*
🪙 Solana:          GET  /api/solana/*
📊 Data:            GET  /api/data/*
🤖 AI:              POST /api/ai/*
🔧 System:          GET  /api/system/*

WebSocket Events:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖥️  terminal:command     - Execute commands
📊 data:subscribe       - Real-time data feeds
🎭 matrix:sync          - Background synchronization
🤖 ai:request           - AI interactions

Ready for terminal connections! 🚀
        `);
      });

    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  private async gracefulShutdown(signal: string): Promise<void> {
    console.log(`\n🛑 Received ${signal}, starting graceful shutdown...`);

    // Stop accepting new connections
    this.server.close(() => {
      console.log('✅ HTTP server closed');
    });

    try {
      // Stop monitoring
      this.monitoringService.stopMonitoring();

      // Stop data streaming
      await this.dataStreamService.stopStreaming();

      // Close Redis connection
      await this.redis.quit();
      console.log('✅ Redis connection closed');

      // Close database connections
      // await this.database.close();

      console.log('✅ Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private getAllowedOrigins(): string[] {
    const origins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    
    if (this.NODE_ENV === 'development') {
      origins.push('http://localhost:5173', 'http://localhost:3000');
    }

    return origins.length > 0 ? origins : ['http://localhost:5173'];
  }

  // Public API for testing
  public getApp() {
    return this.app;
  }

  public getServer() {
    return this.server;
  }

  public getWebSocketManager() {
    return this.wsManager;
  }
}

// ============================================================================
// SERVER STARTUP
// ============================================================================

async function main() {
  console.log(`
██╗  ██╗ ██████╗ ██╗  ██╗    ██╗      █████╗ ██████╗ ███████╗
██║ ██╔╝██╔═══██╗██║  ██║    ██║     ██╔══██╗██╔══██╗██╔════╝
█████╔╝ ██║   ██║███████║    ██║     ███████║██████╔╝███████╗
██╔═██╗ ██║   ██║██╔══██║    ██║     ██╔══██║██╔══██╗╚════██║
██║  ██╗╚██████╔╝██║  ██║    ███████╗██║  ██║██████╔╝███████║
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝    ╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝

Terminal Backend Server v1.0.0
  `);

  const server = new KohLabsTerminalServer();
  await server.start();
}

// Start server if this file is run directly
if (require.main === module) {
  main().catch(console.error);
}

export default KohLabsTerminalServer;