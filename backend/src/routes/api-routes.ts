// API Routes Structure for koH Labs Terminal Backend
// Complete RESTful API design with WebSocket integration

export interface ApiRouteDefinition {
  path: string;
  method: string;
  middleware: string[];
  rateLimit: RateLimitConfig;
  permissions: PermissionLevel[];
  description: string;
}

export enum PermissionLevel {
  PUBLIC = 0,
  AUTHENTICATED = 1,
  ADVANCED = 2,
  ADMIN = 3,
  DANGEROUS = 4 // Requires dangerous mode enabled
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
}

// ============================================================================
// AUTHENTICATION & USER MANAGEMENT
// ============================================================================

export const authRoutes: ApiRouteDefinition[] = [
  {
    path: '/api/auth/connect-wallet',
    method: 'POST',
    middleware: ['validateWallet', 'sanitizeInput'],
    rateLimit: { windowMs: 60000, maxRequests: 10 },
    permissions: [PermissionLevel.PUBLIC],
    description: 'Connect Solana wallet and create/update user session'
  },
  {
    path: '/api/auth/session',
    method: 'GET',
    middleware: ['authenticateSession'],
    rateLimit: { windowMs: 60000, maxRequests: 100 },
    permissions: [PermissionLevel.AUTHENTICATED],
    description: 'Get current user session information'
  },
  {
    path: '/api/auth/logout',
    method: 'POST',
    middleware: ['authenticateSession'],
    rateLimit: { windowMs: 60000, maxRequests: 20 },
    permissions: [PermissionLevel.AUTHENTICATED],
    description: 'End user session and cleanup WebSocket connections'
  }
];

// ============================================================================
// TERMINAL COMMAND SYSTEM
// ============================================================================

export const commandRoutes: ApiRouteDefinition[] = [
  {
    path: '/api/commands/execute',
    method: 'POST',
    middleware: ['authenticateSession', 'validateCommand', 'logCommand'],
    rateLimit: { windowMs: 1000, maxRequests: 20 }, // Aggressive rate limiting
    permissions: [PermissionLevel.AUTHENTICATED],
    description: 'Execute terminal command with safety checks'
  },
  {
    path: '/api/commands/validate',
    method: 'POST',
    middleware: ['authenticateSession', 'validateCommand'],
    rateLimit: { windowMs: 1000, maxRequests: 50 },
    permissions: [PermissionLevel.AUTHENTICATED],
    description: 'Validate command syntax without execution'
  },
  {
    path: '/api/commands/history',
    method: 'GET',
    middleware: ['authenticateSession', 'paginationParams'],
    rateLimit: { windowMs: 60000, maxRequests: 100 },
    permissions: [PermissionLevel.AUTHENTICATED],
    description: 'Get user command history with pagination'
  },
  {
    path: '/api/commands/autocomplete',
    method: 'POST',
    middleware: ['authenticateSession'],
    rateLimit: { windowMs: 1000, maxRequests: 100 },
    permissions: [PermissionLevel.AUTHENTICATED],
    description: 'Get command autocomplete suggestions'
  },
  {
    path: '/api/commands/dangerous-mode/toggle',
    method: 'POST',
    middleware: ['authenticateSession', 'requireAdvanced'],
    rateLimit: { windowMs: 300000, maxRequests: 5 }, // 5 times per 5 minutes
    permissions: [PermissionLevel.ADVANCED],
    description: 'Enable/disable dangerous command mode'
  }
];

// ============================================================================
// SOLANA & DeFi DATA
// ============================================================================

export const solanaRoutes: ApiRouteDefinition[] = [
  {
    path: '/api/solana/token/:mintAddress',
    method: 'GET',
    middleware: ['cacheMiddleware'],
    rateLimit: { windowMs: 10000, maxRequests: 100 },
    permissions: [PermissionLevel.PUBLIC],
    description: 'Get token information by mint address'
  },
  {
    path: '/api/solana/token/:mintAddress/price',
    method: 'GET',
    middleware: ['cacheMiddleware'],
    rateLimit: { windowMs: 5000, maxRequests: 200 },
    permissions: [PermissionLevel.PUBLIC],
    description: 'Get current token price and market data'
  },
  {
    path: '/api/solana/wallet/:address/balance',
    method: 'GET',
    middleware: ['authenticateSession', 'validateWalletOwnership'],
    rateLimit: { windowMs: 10000, maxRequests: 50 },
    permissions: [PermissionLevel.AUTHENTICATED],
    description: 'Get wallet balance and token holdings'
  },
  {
    path: '/api/solana/transaction/simulate',
    method: 'POST',
    middleware: ['authenticateSession', 'validateTransaction'],
    rateLimit: { windowMs: 10000, maxRequests: 20 },
    permissions: [PermissionLevel.AUTHENTICATED],
    description: 'Simulate transaction before execution'
  },
  {
    path: '/api/solana/transaction/execute',
    method: 'POST',
    middleware: ['authenticateSession', 'validateTransaction', 'dangerousModeCheck'],
    rateLimit: { windowMs: 30000, maxRequests: 10 },
    permissions: [PermissionLevel.DANGEROUS],
    description: 'Execute blockchain transaction (requires dangerous mode)'
  }
];

// ============================================================================
// REAL-TIME DATA & STREAMING
// ============================================================================

export const dataRoutes: ApiRouteDefinition[] = [
  {
    path: '/api/data/token/:mintAddress/stream',
    method: 'GET',
    middleware: ['authenticateSession', 'upgradeToWebSocket'],
    rateLimit: { windowMs: 60000, maxRequests: 10 },
    permissions: [PermissionLevel.AUTHENTICATED],
    description: 'Upgrade to WebSocket for real-time token data'
  },
  {
    path: '/api/data/market/overview',
    method: 'GET',
    middleware: ['cacheMiddleware'],
    rateLimit: { windowMs: 30000, maxRequests: 100 },
    permissions: [PermissionLevel.PUBLIC],
    description: 'Get market overview with cached data'
  },
  {
    path: '/api/data/analytics/sentiment',
    method: 'GET',
    middleware: ['authenticateSession', 'cacheMiddleware'],
    rateLimit: { windowMs: 60000, maxRequests: 50 },
    permissions: [PermissionLevel.AUTHENTICATED],
    description: 'Get social sentiment analysis for tokens'
  },
  {
    path: '/api/data/user/watchlist',
    method: 'GET',
    middleware: ['authenticateSession'],
    rateLimit: { windowMs: 10000, maxRequests: 100 },
    permissions: [PermissionLevel.AUTHENTICATED],
    description: 'Get user token watchlist'
  },
  {
    path: '/api/data/user/watchlist',
    method: 'POST',
    middleware: ['authenticateSession', 'validateTokenInput'],
    rateLimit: { windowMs: 10000, maxRequests: 50 },
    permissions: [PermissionLevel.AUTHENTICATED],
    description: 'Add token to user watchlist'
  }
];

// ============================================================================
// AI & AUTOMATION
// ============================================================================

export const aiRoutes: ApiRouteDefinition[] = [
  {
    path: '/api/ai/predict-command',
    method: 'POST',
    middleware: ['authenticateSession', 'aiRateLimit'],
    rateLimit: { windowMs: 5000, maxRequests: 30 },
    permissions: [PermissionLevel.AUTHENTICATED],
    description: 'Get AI-powered command predictions'
  },
  {
    path: '/api/ai/explain',
    method: 'POST',
    middleware: ['authenticateSession', 'aiRateLimit'],
    rateLimit: { windowMs: 10000, maxRequests: 20 },
    permissions: [PermissionLevel.AUTHENTICATED],
    description: 'Get AI explanation of market data or commands'
  },
  {
    path: '/api/ai/mode/toggle',
    method: 'POST',
    middleware: ['authenticateSession'],
    rateLimit: { windowMs: 60000, maxRequests: 10 },
    permissions: [PermissionLevel.AUTHENTICATED],
    description: 'Toggle AI assistance mode (off/assisted/auto)'
  },
  {
    path: '/api/ai/feedback',
    method: 'POST',
    middleware: ['authenticateSession'],
    rateLimit: { windowMs: 10000, maxRequests: 100 },
    permissions: [PermissionLevel.AUTHENTICATED],
    description: 'Submit feedback on AI predictions for learning'
  }
];

// ============================================================================
// SYSTEM & MONITORING
// ============================================================================

export const systemRoutes: ApiRouteDefinition[] = [
  {
    path: '/api/system/health',
    method: 'GET',
    middleware: [],
    rateLimit: { windowMs: 1000, maxRequests: 1000 },
    permissions: [PermissionLevel.PUBLIC],
    description: 'System health check endpoint'
  },
  {
    path: '/api/system/metrics',
    method: 'GET',
    middleware: ['requireAdmin'],
    rateLimit: { windowMs: 5000, maxRequests: 100 },
    permissions: [PermissionLevel.ADMIN],
    description: 'Get system performance metrics'
  },
  {
    path: '/api/system/websocket/stats',
    method: 'GET',
    middleware: ['requireAdmin'],
    rateLimit: { windowMs: 10000, maxRequests: 50 },
    permissions: [PermissionLevel.ADMIN],
    description: 'Get WebSocket connection statistics'
  }
];

// ============================================================================
// WEBSOCKET EVENT DEFINITIONS
// ============================================================================

export interface WebSocketEvent {
  event: string;
  description: string;
  permissions: PermissionLevel[];
  rateLimit: RateLimitConfig;
}

export const webSocketEvents: WebSocketEvent[] = [
  {
    event: 'terminal:command',
    description: 'Execute terminal command via WebSocket',
    permissions: [PermissionLevel.AUTHENTICATED],
    rateLimit: { windowMs: 1000, maxRequests: 20 }
  },
  {
    event: 'terminal:output',
    description: 'Receive terminal command output',
    permissions: [PermissionLevel.AUTHENTICATED],
    rateLimit: { windowMs: 1000, maxRequests: 1000 }
  },
  {
    event: 'data:subscribe',
    description: 'Subscribe to real-time data feed',
    permissions: [PermissionLevel.AUTHENTICATED],
    rateLimit: { windowMs: 10000, maxRequests: 50 }
  },
  {
    event: 'data:unsubscribe',
    description: 'Unsubscribe from data feed',
    permissions: [PermissionLevel.AUTHENTICATED],
    rateLimit: { windowMs: 1000, maxRequests: 100 }
  },
  {
    event: 'data:token_update',
    description: 'Receive token price/data updates',
    permissions: [PermissionLevel.AUTHENTICATED],
    rateLimit: { windowMs: 100, maxRequests: 1000 }
  },
  {
    event: 'matrix:sync',
    description: 'Sync Matrix background with user activity',
    permissions: [PermissionLevel.AUTHENTICATED],
    rateLimit: { windowMs: 1000, maxRequests: 60 }
  },
  {
    event: 'ai:suggestion',
    description: 'Receive AI command suggestions',
    permissions: [PermissionLevel.AUTHENTICATED],
    rateLimit: { windowMs: 2000, maxRequests: 30 }
  }
];

// Export all route definitions
export const allRoutes = [
  ...authRoutes,
  ...commandRoutes,
  ...solanaRoutes,
  ...dataRoutes,
  ...aiRoutes,
  ...systemRoutes
];