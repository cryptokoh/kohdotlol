// Solana DeFi Constants and Configuration
import { PublicKey } from '@solana/web3.js'

// Network Configuration
export const NETWORK = {
  MAINNET: 'mainnet-beta',
  DEVNET: 'devnet',
  TESTNET: 'testnet',
}

export const RPC_ENDPOINTS = {
  [NETWORK.MAINNET]: 'https://api.mainnet-beta.solana.com',
  [NETWORK.DEVNET]: 'https://api.devnet.solana.com',
  [NETWORK.TESTNET]: 'https://api.testnet.solana.com',
}

// Token Configuration
export const TOKENS = {
  KOHLABS: {
    symbol: 'KOHLABS',
    decimals: 9,
    mint: null, // To be set when token is deployed
    name: 'koHLabs Token',
  },
  SOL: {
    symbol: 'SOL',
    decimals: 9,
    mint: PublicKey.default,
    name: 'Solana',
  },
  USDC: {
    symbol: 'USDC',
    decimals: 6,
    mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), // Mainnet USDC
    name: 'USD Coin',
  },
}

// Streaming Configuration
export const STREAM_CONFIG = {
  MIN_DURATION: 60, // 1 minute minimum
  MAX_DURATION: 31536000, // 1 year maximum
  DEFAULT_CLIFF: 0, // No cliff by default
  RELEASE_FREQUENCY: 1, // Release every second
  FEE_PERCENTAGE: 0.25, // Streamflow fee
}

// Staking Configuration
export const STAKING_CONFIG = {
  MIN_STAKE: 100, // Minimum stake amount
  LOCK_PERIODS: {
    FLEXIBLE: { days: 0, apy: 5 },
    WEEK: { days: 7, apy: 8 },
    MONTH: { days: 30, apy: 12 },
    QUARTER: { days: 90, apy: 18 },
    YEAR: { days: 365, apy: 25 },
  },
  EARLY_WITHDRAWAL_PENALTY: 10, // 10% penalty
  REWARD_INTERVAL: 86400, // Daily rewards
}

// Jupiter Configuration
export const JUPITER_CONFIG = {
  API_URL: 'https://quote-api.jup.ag/v6',
  DEFAULT_SLIPPAGE: 300, // 3% in basis points
  PUMP_FUN_SLIPPAGE: 500, // 5% for pump.fun tokens
  PRIORITY_FEE: 0.00005, // Priority fee in SOL
}

// Transaction Settings
export const TRANSACTION_CONFIG = {
  CONFIRMATION_LEVEL: 'confirmed',
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  SIMULATION_ENABLED: true,
}

// Terminal Commands
export const COMMANDS = {
  // Streaming
  STREAM_CREATE: 'stream create',
  STREAM_CANCEL: 'stream cancel',
  STREAM_LIST: 'stream list',
  STREAM_INFO: 'stream info',
  VESTING_CREATE: 'vesting create',
  VESTING_INFO: 'vesting info',
  
  // Trading
  SWAP: 'swap',
  PRICE: 'price',
  PRICE_IMPACT: 'price-impact',
  LIQUIDITY_ADD: 'liquidity add',
  LIQUIDITY_REMOVE: 'liquidity remove',
  
  // Staking
  STAKE: 'stake',
  UNSTAKE: 'unstake',
  REWARDS_CLAIM: 'rewards claim',
  STAKING_INFO: 'staking-info',
  
  // Wallet
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  BALANCE: 'balance',
  HISTORY: 'history',
  
  // Utility
  HELP: 'help',
  CLEAR: 'clear',
  EXIT: 'exit',
}

// Error Messages
export const ERRORS = {
  WALLET_NOT_CONNECTED: 'Wallet not connected. Use "connect" command first.',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this operation.',
  INVALID_AMOUNT: 'Invalid amount. Please enter a valid number.',
  INVALID_ADDRESS: 'Invalid Solana address.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  STREAM_NOT_FOUND: 'Stream not found.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SIMULATION_FAILED: 'Transaction simulation failed. Operation cancelled.',
}

// Success Messages (Laboratory Style)
export const SUCCESS = {
  WALLET_CONNECTED: '🔗 QUANTUM ENTANGLEMENT ESTABLISHED: Wallet successfully linked to laboratory systems!',
  STREAM_CREATED: '💧 MOLECULAR FLOW INITIATED: Stream successfully synthesized and deployed to the blockchain!',
  STREAM_CANCELLED: '🛑 FLOW TERMINATED: Molecular stream safely deactivated and compounds recovered!',
  SWAP_COMPLETED: '⚛️ ATOMIC EXCHANGE SUCCESSFUL: Molecular transformation completed with perfect precision!',
  STAKE_COMPLETED: '🔒 COMPOUND CRYSTALLIZED: Tokens successfully locked in our diamond lattice structure!',
  UNSTAKE_COMPLETED: '💎 CRYSTAL DISSOLUTION: Compounds extracted from lattice and returned to liquid form!',
  REWARDS_CLAIMED: '🏆 EXPERIMENT REWARDS HARVESTED: Research dividends successfully collected from the lab!',
  TRANSACTION_CONFIRMED: '✅ MOLECULAR BOND CONFIRMED: Transaction permanently etched into the blockchain ledger!',
  ANALYSIS_COMPLETE: '🧬 DNA SEQUENCE DECODED: Comprehensive analysis of your portfolio genetics complete!',
}

// Laboratory Safety Tips
export const LAB_SAFETY_TIPS = [
  '⚠️ Remember to wear safety goggles when handling volatile tokens',
  '🧤 Always use protective gloves when touching smart contracts',
  '🔥 Keep flammable assets away from market heat',
  '💎 Diamond hands prevent chemical burns from paper hands',
  '⚗️ Never mix FUD with your experimental portfolio',
  '🌡️ Monitor temperature: market too hot? Add ice (stablecoin)',
  '🥽 Safety first: Always DYOR before entering the lab',
  '🧬 DNA analysis shows: HODL genes are dominant traits',
  '⚡ High voltage warning: Keep excitement levels under control',
  '🚀 Rocket fuel is highly combustible - handle moon missions carefully'
]

// Mad Scientist Responses
export const SCIENTIST_RESPONSES = {
  PROCESSING: [
    '🧬 Sequencing genetic code...',
    '⚗️ Mixing volatile compounds...',
    '🔬 Analyzing molecular structure...',
    '💎 Crystallizing diamond lattice...',
    '🚀 Calculating orbital trajectory...'
  ],
  SUCCESS: [
    '🧪 EUREKA! The experiment was a complete success!',
    '⚡ BREAKTHROUGH! Molecular bonds formed perfectly!', 
    '🔬 HYPOTHESIS CONFIRMED! Results exceeded expectations!',
    '💎 CRYSTALLIZATION COMPLETE! Diamond structure achieved!',
    '🚀 IGNITION SEQUENCE SUCCESSFUL! We have liftoff!'
  ],
  ERROR: [
    '💥 CHEMICAL REACTION FAILED! Adjusting molecular formula...',
    '⚠️ EXPERIMENT UNSTABLE! Initiating safety protocols...', 
    '🧪 MIXTURE REJECTED! Incompatible compounds detected...',
    '🔥 COMBUSTION ERROR! Cooling chambers activated...',
    '⚡ CIRCUIT OVERLOAD! Rerouting power through backup systems...'
  ]
}