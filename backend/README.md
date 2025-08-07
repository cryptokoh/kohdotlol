# koH Labs Terminal Backend

A high-performance Node.js backend server for the koH Labs Terminal Interface, featuring real-time WebSocket communication, Solana blockchain integration, AI-powered command prediction, and DeFi data streaming.

## 🚀 Features

### Core Terminal System
- **Command Processing Engine** - Advanced command parser with validation and execution
- **WebSocket Real-time Communication** - Sub-100ms terminal response times
- **Session Management** - Secure user sessions with Redis-backed storage
- **Permission System** - Multi-level permissions with "dangerous mode" safety controls

### Blockchain Integration
- **Solana Web3.js Integration** - Complete Solana blockchain interaction
- **Jupiter DEX Aggregation** - Best-price token swapping with slippage protection
- **Token Discovery** - Real-time token information and trending tokens
- **Wallet Operations** - Balance checking, transaction simulation, and execution

### Real-time Data Streaming
- **Market Data Feeds** - Live price, volume, and market cap updates  
- **Social Sentiment Analysis** - Twitter/Reddit sentiment tracking
- **Multi-source Price Aggregation** - CoinGecko, Birdeye, DexScreener integration
- **WebSocket Event System** - Efficient real-time data distribution

### AI & Automation
- **Command Prediction** - AI-powered command suggestions based on user patterns
- **Auto-completion** - Intelligent command and argument completion
- **Market Analysis** - AI-powered market trend analysis and explanations
- **Pattern Recognition** - User behavior analysis for predictive features

### Performance & Scaling
- **Redis Caching** - Multi-layer caching for sub-second response times
- **Rate Limiting** - Advanced rate limiting with user-specific quotas
- **Connection Pooling** - Optimized database and RPC connection management
- **Horizontal Scaling** - Ready for multi-instance deployment

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │◄───┤  Load Balancer  │────┤  API Gateway    │
│   (Terminal UI) │    │   (nginx/AWS)   │    │  (Express.js)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
       ┌────────────────────────────────────────────────┼────────────────┐
       │                                                │                │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  WebSocket      │    │  Command        │    │  Data Service   │
│  Server         │    │  Processor      │    │  Layer          │
│  (Socket.io)    │    │  Engine         │    │  (Aggregation)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
       │                        │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Session        │    │  AI Command     │    │  External APIs  │
│  Manager        │    │  Predictor      │    │  (Solana, DeFi) │
│  (Redis)        │    │  (ML Service)   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                              ┌─────────────────┐    ┌─────────────────┐
                              │  PostgreSQL     │    │  Redis Cache    │
                              │  (User Data,    │    │  (Real-time     │
                              │   History, Logs)│    │   Data, Sessions)│
                              └─────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

- **Runtime**: Node.js 20+ with ES modules
- **Framework**: Express.js with TypeScript
- **WebSocket**: Socket.io 4.x for real-time communication
- **Database**: PostgreSQL 16+ (primary) + Redis 7+ (cache/sessions)
- **Blockchain**: @solana/web3.js + Jupiter aggregator
- **AI Integration**: OpenAI API + Anthropic Claude API
- **Monitoring**: Prometheus + Winston logging

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Solana RPC endpoint access

### Installation

```bash
# Clone the repository
git clone https://github.com/kohlabs/terminal-backend.git
cd terminal-backend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Configure your environment variables
nano .env

# Set up database
npm run db:migrate

# Start development server
npm run dev
```

### Environment Setup

Key environment variables you need to configure:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/kohlabs_terminal
REDIS_HOST=localhost
REDIS_PORT=6379

# Solana
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# AI Services (optional)
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# Security
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
```

## 📡 API Endpoints

### Authentication & User Management
- `POST /api/auth/connect-wallet` - Connect Solana wallet
- `GET /api/auth/session` - Get session info  
- `POST /api/auth/logout` - End session

### Terminal Commands
- `POST /api/commands/execute` - Execute terminal command
- `POST /api/commands/validate` - Validate command syntax
- `GET /api/commands/history` - Get command history
- `POST /api/commands/autocomplete` - Get autocomplete suggestions

### Solana & DeFi
- `GET /api/solana/token/:mintAddress` - Get token information
- `GET /api/solana/wallet/:address/balance` - Get wallet balance
- `POST /api/solana/transaction/simulate` - Simulate transaction
- `POST /api/solana/transaction/execute` - Execute transaction

### Real-time Data
- `GET /api/data/token/:mintAddress/stream` - WebSocket upgrade for token data
- `GET /api/data/market/overview` - Market overview
- `GET /api/data/analytics/sentiment` - Social sentiment analysis

### AI & Automation  
- `POST /api/ai/predict-command` - Get command predictions
- `POST /api/ai/explain` - Get AI explanations
- `POST /api/ai/mode/toggle` - Toggle AI assistance mode

## 🔌 WebSocket Events

### Client → Server
- `authenticate` - Authenticate WebSocket connection
- `terminal:command` - Execute terminal command
- `data:subscribe` - Subscribe to real-time data
- `matrix:activity` - Sync Matrix background activity
- `ai:request` - AI assistance requests

### Server → Client
- `terminal:output` - Command execution results
- `data:price_update` - Real-time price updates
- `data:market_update` - Market data updates
- `matrix:sync` - Matrix background synchronization
- `ai:suggestions` - AI command suggestions

## 💻 Available Terminal Commands

### System Commands
- `help [command]` - Show help information
- `clear` - Clear terminal screen
- `history` - Show command history
- `whoami` - Show current user info
- `dangerous-mode [on|off]` - Toggle dangerous mode

### Token & DeFi Commands
- `token <mint-address>` - Get token information
- `balance [address]` - Show wallet balance
- `price <symbol>` - Get token price
- `swap <from> <to> <amount>` - Simulate/execute token swap
- `watchlist [add|remove|list]` - Manage token watchlist

### Market Data Commands
- `market` - Show market overview
- `trending` - Show trending tokens
- `sentiment <token>` - Show social sentiment

### AI Commands
- `explain <topic>` - Get AI explanation
- `predict` - Get market predictions
- `analyze <token>` - AI-powered token analysis

## 🔧 Development

### Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run typecheck    # Type checking
```

### Database Management
```bash
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed development data
```

### Docker Support
```bash
npm run docker:build # Build Docker image
npm run docker:run   # Run in Docker container
```

## 📊 Monitoring & Analytics

### Health Monitoring
- **Health Check**: `GET /health` - Server health status
- **System Metrics**: Real-time performance monitoring
- **WebSocket Stats**: Connection and event tracking

### Logging
- **Winston Integration** - Structured logging with multiple levels
- **Request Logging** - All API requests logged with timing
- **Error Tracking** - Comprehensive error logging and alerting

### Performance Monitoring
- **Response Times** - API and WebSocket response time tracking
- **Rate Limiting** - Request rate monitoring and limiting
- **Resource Usage** - Memory, CPU, and database connection tracking

## 🔒 Security Features

### Authentication & Authorization
- **JWT-based Authentication** - Secure token-based auth
- **Permission Levels** - Multi-tier permission system
- **Session Management** - Redis-backed session storage

### Input Validation & Sanitization
- **Command Validation** - Strict command syntax validation
- **Input Sanitization** - All inputs sanitized against injection
- **Rate Limiting** - Per-user and per-IP rate limiting

### Dangerous Mode Safety
- **Permission Gates** - Risky operations require explicit permission
- **Transaction Simulation** - All transactions simulated before execution
- **Confirmation Requirements** - Multi-step confirmation for dangerous operations

## 🚀 Deployment

### Production Environment
```bash
# Install production dependencies
npm ci --production

# Build the application
npm run build

# Start with PM2 (recommended)
pm2 start ecosystem.config.js

# Or start directly
npm run start:prod
```

### Environment Variables for Production
```bash
NODE_ENV=production
DATABASE_SSL=true
REDIS_PASSWORD=your-redis-password
CLUSTER_ENABLED=true
COMPRESSION_LEVEL=9
```

### Docker Deployment
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 📈 Performance Benchmarks

### Response Times (Development)
- **Command Execution**: ~50ms average
- **WebSocket Events**: ~10ms latency
- **Database Queries**: ~25ms average
- **External API Calls**: ~200ms average (cached: ~5ms)

### Scalability
- **Concurrent Connections**: 10,000+ WebSocket connections
- **Commands per Second**: 500+ terminal commands
- **API Requests**: 1000+ requests per second
- **Database Connections**: Optimized connection pooling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow semantic versioning

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Solana Labs](https://solana.com) for blockchain infrastructure
- [Jupiter](https://jup.ag) for DEX aggregation
- [Socket.io](https://socket.io) for real-time communication
- OpenAI and Anthropic for AI integration

---

**koH Labs Terminal Backend** - Powering the next generation of DeFi terminal interfaces 🚀