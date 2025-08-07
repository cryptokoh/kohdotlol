# koHLabs DeFi Terminal - Solana Integration

## Overview

The koHLabs DeFi Terminal is a command-line interface for interacting with Solana DeFi protocols, featuring token streaming via Streamflow Finance, best-price swaps through Jupiter, and advanced staking mechanisms for the $koHLabs token ecosystem.

## Features

### 1. Token Streaming (Streamflow Finance)
- **Payment Streams**: Create continuous payment flows to recipients
- **Vesting Schedules**: Set up token vesting with cliff periods
- **Stream Management**: Cancel, transfer, and monitor active streams
- **Automatic Withdrawals**: Configure automated token distributions

### 2. Token Swapping (Jupiter Aggregator)
- **Best Price Discovery**: Automatically finds optimal swap routes
- **Price Impact Calculation**: Real-time slippage and impact analysis
- **Multi-Route Support**: Splits trades across DEXs for best execution
- **Transaction Simulation**: Preview swaps before execution

### 3. Staking System
- **Flexible Pools**: Multiple lock periods with varying APY
- **Reward Streaming**: Continuous reward distribution
- **Early Withdrawal**: Force unstake with penalty options
- **Compound Rewards**: Auto-compound staking rewards

## Terminal Commands

### Streaming Commands
```bash
# Create a payment stream
stream create <recipient> <amount> <duration-seconds> [name]
# Example: stream create 7xKXt...wZca 1000 86400 "Daily Payment"

# Cancel a stream
stream cancel <stream-id>

# List all streams
stream list [active|all]

# Get stream details
stream info <stream-id>

# Create vesting schedule
vesting create <recipient> <total> <cliff-days> <vesting-days> [name]
# Example: vesting create 7xKXt...wZca 10000 30 365 "Team Vesting"
```

### Trading Commands
```bash
# Swap tokens
swap <from-token> <to-token> <amount> [--slippage=3]
# Example: swap SOL USDC 10 --slippage=2.5

# Check token price
price <token-symbol>
# Example: price KOHLABS

# Calculate price impact
price-impact <from> <to> <amount>
# Example: price-impact SOL USDC 100
```

### Staking Commands
```bash
# Stake tokens
stake <amount> [--lock-period=flexible|week|month|quarter|year]
# Example: stake 1000 --lock-period=month

# Unstake tokens
unstake <stake-id> [--force]
# Example: unstake stake_1234 --force

# Claim rewards
rewards claim [stake-id]

# View staking info
staking-info
```

### Wallet Commands
```bash
# Check balance
balance [token]

# View transaction history
history [limit]

# Connect wallet (use UI button)
connect

# Clear terminal
clear

# Show help
help
```

## Architecture

### Core Services

#### StreamflowService
- Manages token streaming operations
- Handles vesting schedule creation
- Provides stream monitoring and management
- Integrates with Streamflow Finance SDK

#### JupiterService
- Executes token swaps with best prices
- Calculates price impact and slippage
- Simulates transactions before execution
- Routes through multiple DEXs

#### StakingService
- Manages staking pools and user stakes
- Calculates and distributes rewards
- Handles lock periods and penalties
- Tracks staking statistics

#### CommandParser
- Interprets terminal commands
- Validates inputs and parameters
- Routes commands to appropriate services
- Formats output for terminal display

### Technical Stack
- **Framework**: React with Vite
- **Blockchain**: Solana Web3.js
- **Streaming**: Streamflow Finance SDK
- **Swaps**: Jupiter Aggregator API
- **Wallet**: Solana Wallet Adapter
- **UI**: Tailwind CSS with terminal styling

## Configuration

### Network Settings
```javascript
// src/defi/constants.js
export const NETWORK = {
  MAINNET: 'mainnet-beta',
  DEVNET: 'devnet',
  TESTNET: 'testnet',
}
```

### Token Configuration
```javascript
export const TOKENS = {
  KOHLABS: {
    symbol: 'KOHLABS',
    decimals: 9,
    mint: null, // Set when deployed
    name: 'koHLabs Token',
  },
  // Additional tokens...
}
```

### Staking Pools
```javascript
export const STAKING_CONFIG = {
  MIN_STAKE: 100,
  LOCK_PERIODS: {
    FLEXIBLE: { days: 0, apy: 5 },
    WEEK: { days: 7, apy: 8 },
    MONTH: { days: 30, apy: 12 },
    QUARTER: { days: 90, apy: 18 },
    YEAR: { days: 365, apy: 25 },
  },
  EARLY_WITHDRAWAL_PENALTY: 10, // 10%
}
```

## Security Features

### Transaction Safety
- **Simulation First**: All transactions are simulated before execution
- **Confirmation Prompts**: Clear transaction summaries before signing
- **Slippage Protection**: Configurable maximum slippage limits
- **Error Recovery**: Graceful handling of failed transactions

### Wallet Security
- **Read-Only by Default**: No automatic transaction execution
- **Clear Signing**: Transparent transaction details
- **Multi-Sig Support**: Compatible with multi-signature wallets
- **Session Management**: Secure wallet connection handling

## User Experience

### Terminal Interface
- **Command History**: Navigate previous commands with arrow keys
- **Auto-Complete**: Tab completion for commands (planned)
- **Progress Indicators**: ASCII progress bars for operations
- **Color Coding**: Visual feedback for success/error states

### Error Handling
- **Descriptive Messages**: Clear error explanations
- **Recovery Suggestions**: Actionable next steps
- **Network Resilience**: Automatic retry with backoff
- **Validation Feedback**: Input validation before execution

## Development

### Setup
```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure
```
src/defi/
├── constants.js           # Configuration and constants
├── DeFiTerminal.jsx       # Main terminal component
├── CommandParser.js       # Command interpreter
├── WalletProvider.jsx     # Wallet connection setup
├── streamflow/
│   └── StreamflowService.js   # Streaming operations
├── jupiter/
│   └── JupiterService.js      # Token swapping
└── staking/
    └── StakingService.js      # Staking mechanism
```

### Testing Commands
```bash
# Test stream creation (devnet)
stream create <your-wallet> 10 60 "Test Stream"

# Test token swap simulation
swap SOL USDC 1 --slippage=3

# Test staking
stake 100 --lock-period=flexible
```

## Future Enhancements

### Planned Features
- **Batch Operations**: Execute multiple operations in one transaction
- **Advanced Analytics**: Historical performance tracking
- **Governance Integration**: DAO voting through terminal
- **Cross-Chain Bridges**: Support for multi-chain operations
- **Automated Strategies**: DCA, yield farming automation

### Optimization Opportunities
- **Command Auto-Complete**: Intelligent command suggestions
- **Transaction Bundling**: Reduce fees with bundled operations
- **Caching Layer**: Improve response times with smart caching
- **WebSocket Updates**: Real-time stream and price updates

## Integration Examples

### Creating a Payment Stream
```javascript
const result = await streamflowService.createStream({
  recipient: '7xKXtg2CW87d4WcZqgRcvwZca',
  amount: 1000,
  tokenMint: TOKENS.KOHLABS.mint,
  duration: 86400, // 24 hours
  name: 'Daily Payment',
})
```

### Executing a Swap
```javascript
const swapResult = await jupiterService.executeSwap({
  inputMint: TOKENS.SOL.mint,
  outputMint: TOKENS.USDC.mint,
  amount: 1e9, // 1 SOL
  slippageBps: 300, // 3%
})
```

### Staking Tokens
```javascript
const stakeResult = await stakingService.stakeTokens({
  amount: 1000,
  poolId: 'MONTH',
  tokenMint: TOKENS.KOHLABS.mint,
})
```

## Support & Resources

- **Documentation**: [Streamflow Docs](https://docs.streamflow.finance)
- **Jupiter API**: [Jupiter Station](https://station.jup.ag)
- **Solana Cookbook**: [Solana Development Guide](https://solanacookbook.com)

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please follow the existing code style and add tests for new features.

---

Built with 💜 by koHLabs - Bringing DeFi to the command line