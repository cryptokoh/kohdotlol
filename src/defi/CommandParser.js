// Command Parser for DeFi Terminal
import { PublicKey } from '@solana/web3.js'
import { COMMANDS, TOKENS, ERRORS } from './constants'

export class CommandParser {
  constructor({ streamflowService, jupiterService, stakingService, wallet, connection }) {
    this.streamflow = streamflowService
    this.jupiter = jupiterService
    this.staking = stakingService
    this.wallet = wallet
    this.connection = connection
  }

  /**
   * Parse and execute a command
   */
  async parse(input) {
    const parts = input.trim().split(/\s+/)
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    try {
      // Streaming commands
      if (command === 'stream') {
        return await this.handleStreamCommand(args)
      }
      
      // Vesting commands
      if (command === 'vesting') {
        return await this.handleVestingCommand(args)
      }
      
      // Trading commands
      if (command === 'swap') {
        return await this.handleSwapCommand(args)
      }
      
      if (command === 'price') {
        return await this.handlePriceCommand(args)
      }
      
      if (command === 'price-impact') {
        return await this.handlePriceImpactCommand(args)
      }
      
      // Staking commands
      if (command === 'stake') {
        return await this.handleStakeCommand(args)
      }
      
      if (command === 'unstake') {
        return await this.handleUnstakeCommand(args)
      }
      
      if (command === 'rewards') {
        return await this.handleRewardsCommand(args)
      }
      
      if (command === 'staking-info') {
        return await this.handleStakingInfoCommand()
      }
      
      // Wallet commands
      if (command === 'balance') {
        return await this.handleBalanceCommand(args)
      }
      
      if (command === 'history') {
        return await this.handleHistoryCommand(args)
      }
      
      // Unknown command
      return {
        success: false,
        error: `Unknown command: ${command}. Type "help" for available commands.`,
      }
    } catch (error) {
      console.error('Command parsing error:', error)
      return {
        success: false,
        error: error.message || 'Command execution failed',
      }
    }
  }

  /**
   * Handle stream commands
   */
  async handleStreamCommand(args) {
    const subcommand = args[0]
    
    switch (subcommand) {
      case 'create':
        return await this.createStream(args.slice(1))
      case 'cancel':
        return await this.cancelStream(args.slice(1))
      case 'list':
        return await this.listStreams(args.slice(1))
      case 'info':
        return await this.getStreamInfo(args.slice(1))
      default:
        return {
          success: false,
          error: 'Invalid stream command. Use: create, cancel, list, or info',
        }
    }
  }

  /**
   * Create a payment stream
   */
  async createStream(args) {
    if (args.length < 3) {
      return {
        success: false,
        error: 'Usage: stream create <recipient> <amount> <duration-in-seconds> [name]',
      }
    }

    const [recipient, amount, duration, ...nameParts] = args
    const name = nameParts.join(' ') || 'koHLabs Stream'

    // Validate recipient address
    try {
      new PublicKey(recipient)
    } catch {
      return {
        success: false,
        error: ERRORS.INVALID_ADDRESS,
      }
    }

    // Validate amount
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return {
        success: false,
        error: ERRORS.INVALID_AMOUNT,
      }
    }

    // Validate duration
    const durationNum = parseInt(duration)
    if (isNaN(durationNum) || durationNum < 60) {
      return {
        success: false,
        error: 'Duration must be at least 60 seconds',
      }
    }

    // Show confirmation
    const confirmText = `
┌─────────────────────────────────────────┐
│         STREAM CREATION SUMMARY         │
├─────────────────────────────────────────┤
│ Recipient: ${recipient.slice(0, 8)}...${recipient.slice(-8)}
│ Amount: ${amountNum} KOHLABS
│ Duration: ${this.formatDuration(durationNum)}
│ Name: ${name}
│ Start: Immediately
│ End: ${new Date(Date.now() + durationNum * 1000).toLocaleString()}
└─────────────────────────────────────────┘

Creating stream...`

    // Execute stream creation
    const result = await this.streamflow.createStream({
      recipient,
      amount: amountNum,
      tokenMint: TOKENS.KOHLABS.mint || TOKENS.SOL.mint, // Use SOL if KOHLABS not deployed
      duration: durationNum,
      name,
    })

    if (result.success) {
      return {
        success: true,
        output: confirmText,
        data: `✅ Stream created successfully!
Stream ID: ${result.streamId}
Transaction: ${result.txId}
Status: Active`,
      }
    } else {
      return result
    }
  }

  /**
   * Cancel a stream
   */
  async cancelStream(args) {
    if (args.length < 1) {
      return {
        success: false,
        error: 'Usage: stream cancel <stream-id>',
      }
    }

    const streamId = args[0]
    const result = await this.streamflow.cancelStream(streamId)

    if (result.success) {
      return {
        success: true,
        output: `✅ Stream ${streamId} cancelled successfully!
Transaction: ${result.txId}`,
      }
    } else {
      return result
    }
  }

  /**
   * List streams
   */
  async listStreams(args) {
    const direction = args[0] || 'all'
    const result = await this.streamflow.listStreams(direction)

    if (result.success) {
      if (result.streams.length === 0) {
        return {
          success: true,
          output: 'No streams found.',
        }
      }

      const streamList = result.streams.map((stream, index) => `
[${index + 1}] ${stream.name}
    ID: ${stream.id}
    Type: ${stream.type}
    Status: ${stream.status}
    Progress: ${stream.progress}%
    Amount: ${stream.amount} tokens
    Counterparty: ${stream.counterparty.slice(0, 8)}...${stream.counterparty.slice(-8)}
    Started: ${new Date(stream.startTime).toLocaleString()}
    Ends: ${new Date(stream.endTime).toLocaleString()}
`).join('\n')

      return {
        success: true,
        output: `Found ${result.streams.length} stream(s):\n${streamList}`,
      }
    } else {
      return result
    }
  }

  /**
   * Get stream information
   */
  async getStreamInfo(args) {
    if (args.length < 1) {
      return {
        success: false,
        error: 'Usage: stream info <stream-id>',
      }
    }

    const streamId = args[0]
    const result = await this.streamflow.getStreamInfo(streamId)

    if (result.success) {
      const stream = result.stream
      const info = `
┌─────────────────────────────────────────┐
│           STREAM INFORMATION            │
├─────────────────────────────────────────┤
│ ID: ${stream.id}
│ Name: ${stream.name}
│ Status: ${stream.status}
│ Progress: ${stream.progress}%
│
│ PARTICIPANTS
│ Sender: ${stream.sender.slice(0, 8)}...${stream.sender.slice(-8)}
│ Recipient: ${stream.recipient.slice(0, 8)}...${stream.recipient.slice(-8)}
│
│ AMOUNTS
│ Deposited: ${stream.deposited} tokens
│ Withdrawn: ${stream.withdrawn} tokens
│ Available: ${stream.available} tokens
│ Remaining: ${stream.remaining} tokens
│
│ TIMELINE
│ Start: ${new Date(stream.startTime).toLocaleString()}
│ End: ${new Date(stream.endTime).toLocaleString()}
│
│ FEATURES
│ Cancelable: ${stream.cancelable ? 'Yes' : 'No'}
│ Transferable: ${stream.transferable ? 'Yes' : 'No'}
└─────────────────────────────────────────┘`

      return {
        success: true,
        output: info,
      }
    } else {
      return result
    }
  }

  /**
   * Handle vesting commands
   */
  async handleVestingCommand(args) {
    const subcommand = args[0]
    
    switch (subcommand) {
      case 'create':
        return await this.createVesting(args.slice(1))
      case 'info':
        return await this.getVestingInfo(args.slice(1))
      default:
        return {
          success: false,
          error: 'Invalid vesting command. Use: create or info',
        }
    }
  }

  /**
   * Create vesting schedule
   */
  async createVesting(args) {
    if (args.length < 4) {
      return {
        success: false,
        error: 'Usage: vesting create <recipient> <total-amount> <cliff-days> <vesting-days> [name]',
      }
    }

    const [recipient, totalAmount, cliffDays, vestingDays, ...nameParts] = args
    const name = nameParts.join(' ') || 'koHLabs Vesting'

    // Validate inputs
    try {
      new PublicKey(recipient)
    } catch {
      return {
        success: false,
        error: ERRORS.INVALID_ADDRESS,
      }
    }

    const amount = parseFloat(totalAmount)
    const cliff = parseInt(cliffDays) * 86400 // Convert to seconds
    const vesting = parseInt(vestingDays) * 86400 // Convert to seconds

    if (isNaN(amount) || amount <= 0) {
      return {
        success: false,
        error: ERRORS.INVALID_AMOUNT,
      }
    }

    const result = await this.streamflow.createVesting({
      recipient,
      totalAmount: amount,
      tokenMint: TOKENS.KOHLABS.mint || TOKENS.SOL.mint,
      cliffDuration: cliff,
      vestingDuration: vesting,
      name,
    })

    if (result.success) {
      return {
        success: true,
        output: `✅ Vesting schedule created successfully!
Vesting ID: ${result.streamId}
Transaction: ${result.txId}
Total Amount: ${amount} tokens
Cliff: ${cliffDays} days
Vesting Period: ${vestingDays} days`,
      }
    } else {
      return result
    }
  }

  /**
   * Handle swap command
   */
  async handleSwapCommand(args) {
    if (args.length < 3) {
      return {
        success: false,
        error: 'Usage: swap <from-token> <to-token> <amount> [--slippage=3]',
      }
    }

    const [fromSymbol, toSymbol, amountStr, ...flags] = args
    const amount = parseFloat(amountStr)

    if (isNaN(amount) || amount <= 0) {
      return {
        success: false,
        error: ERRORS.INVALID_AMOUNT,
      }
    }

    // Parse slippage from flags
    let slippage = 300 // 3% default
    const slippageFlag = flags.find(f => f.startsWith('--slippage='))
    if (slippageFlag) {
      const slippageValue = parseFloat(slippageFlag.split('=')[1])
      slippage = slippageValue * 100 // Convert to basis points
    }

    // Get token mints (simplified - in production, would have token registry)
    const fromToken = TOKENS[fromSymbol.toUpperCase()]
    const toToken = TOKENS[toSymbol.toUpperCase()]

    if (!fromToken || !toToken) {
      return {
        success: false,
        error: 'Invalid token symbol',
      }
    }

    // Show swap preview
    const preview = `
┌─────────────────────────────────────────┐
│           SWAP PREVIEW                  │
├─────────────────────────────────────────┤
│ From: ${amount} ${fromSymbol.toUpperCase()}
│ To: ${toSymbol.toUpperCase()}
│ Slippage: ${slippage / 100}%
│
│ Fetching best route...
└─────────────────────────────────────────┘`

    // Get quote first
    const quoteResult = await this.jupiter.getQuote({
      inputMint: fromToken.mint,
      outputMint: toToken.mint,
      amount: amount * (10 ** fromToken.decimals),
      slippageBps: slippage,
    })

    if (!quoteResult.success) {
      return quoteResult
    }

    const outputAmount = parseFloat(quoteResult.quote.outputAmount) / (10 ** toToken.decimals)
    const priceImpact = parseFloat(quoteResult.quote.priceImpactPct)

    // Show confirmation
    const confirmation = `
${preview}

ROUTE FOUND:
Expected Output: ${outputAmount.toFixed(6)} ${toSymbol.toUpperCase()}
Price Impact: ${priceImpact.toFixed(4)}%
${priceImpact > 5 ? '⚠️ WARNING: High price impact!' : ''}

Executing swap...`

    // Execute swap
    const swapResult = await this.jupiter.executeSwap({
      inputMint: fromToken.mint,
      outputMint: toToken.mint,
      amount: amount * (10 ** fromToken.decimals),
      slippageBps: slippage,
    })

    if (swapResult.success) {
      return {
        success: true,
        output: confirmation,
        data: `✅ Swap completed successfully!
Transaction: ${swapResult.txId}
Received: ${outputAmount.toFixed(6)} ${toSymbol.toUpperCase()}`,
      }
    } else {
      return swapResult
    }
  }

  /**
   * Handle price command
   */
  async handlePriceCommand(args) {
    if (args.length < 1) {
      return {
        success: false,
        error: 'Usage: price <token-symbol>',
      }
    }

    const symbol = args[0].toUpperCase()
    const token = TOKENS[symbol]

    if (!token) {
      return {
        success: false,
        error: 'Invalid token symbol',
      }
    }

    const result = await this.jupiter.getTokenPrice(token.mint)

    if (result.success) {
      return {
        success: true,
        output: `${symbol} Price: ${result.priceFormatted}`,
      }
    } else {
      return result
    }
  }

  /**
   * Handle price impact command
   */
  async handlePriceImpactCommand(args) {
    if (args.length < 3) {
      return {
        success: false,
        error: 'Usage: price-impact <from-token> <to-token> <amount>',
      }
    }

    const [fromSymbol, toSymbol, amountStr] = args
    const amount = parseFloat(amountStr)

    if (isNaN(amount) || amount <= 0) {
      return {
        success: false,
        error: ERRORS.INVALID_AMOUNT,
      }
    }

    const fromToken = TOKENS[fromSymbol.toUpperCase()]
    const toToken = TOKENS[toSymbol.toUpperCase()]

    if (!fromToken || !toToken) {
      return {
        success: false,
        error: 'Invalid token symbol',
      }
    }

    const result = await this.jupiter.calculatePriceImpact({
      inputMint: fromToken.mint,
      outputMint: toToken.mint,
      amount: amount * (10 ** fromToken.decimals),
    })

    if (result.success) {
      const output = `
┌─────────────────────────────────────────┐
│         PRICE IMPACT ANALYSIS           │
├─────────────────────────────────────────┤
│ Swap: ${amount} ${fromSymbol.toUpperCase()} → ${toSymbol.toUpperCase()}
│
│ Expected Output: ${(result.expectedOutput / (10 ** toToken.decimals)).toFixed(6)} ${toSymbol.toUpperCase()}
│ Actual Output: ${(result.actualOutput / (10 ** toToken.decimals)).toFixed(6)} ${toSymbol.toUpperCase()}
│
│ Price Impact: ${result.priceImpact}%
│ Slippage: ${result.slippage}%
│
│ ${result.warning || 'Price impact is acceptable'}
└─────────────────────────────────────────┘`

      return {
        success: true,
        output,
      }
    } else {
      return result
    }
  }

  /**
   * Handle stake command
   */
  async handleStakeCommand(args) {
    if (args.length < 1) {
      return {
        success: false,
        error: 'Usage: stake <amount> [--lock-period=flexible|week|month|quarter|year]',
      }
    }

    const amount = parseFloat(args[0])
    if (isNaN(amount) || amount <= 0) {
      return {
        success: false,
        error: ERRORS.INVALID_AMOUNT,
      }
    }

    // Parse lock period
    let poolId = 'FLEXIBLE'
    const lockFlag = args.find(arg => arg.startsWith('--lock-period='))
    if (lockFlag) {
      const period = lockFlag.split('=')[1].toUpperCase()
      if (['FLEXIBLE', 'WEEK', 'MONTH', 'QUARTER', 'YEAR'].includes(period)) {
        poolId = period
      }
    }

    const result = await this.staking.stakeTokens({
      amount,
      poolId,
      tokenMint: TOKENS.KOHLABS.mint || TOKENS.SOL.mint,
    })

    if (result.success) {
      const details = result.details
      return {
        success: true,
        output: `✅ Tokens staked successfully!
Transaction: ${result.txId}
Stake ID: ${result.stakeId}

STAKING DETAILS:
Amount: ${details.amount} tokens
Pool: ${details.poolName}
APY: ${details.apy}%
Lock Period: ${details.lockDays} days
Unlock Date: ${new Date(details.unlockDate).toLocaleString()}
Est. Daily Reward: ${details.estimatedDailyReward} tokens`,
      }
    } else {
      return result
    }
  }

  /**
   * Handle unstake command
   */
  async handleUnstakeCommand(args) {
    if (args.length < 1) {
      return {
        success: false,
        error: 'Usage: unstake <stake-id> [--force]',
      }
    }

    const stakeId = args[0]
    const force = args.includes('--force')

    const result = await this.staking.unstakeTokens({ stakeId, force })

    if (result.success) {
      const details = result.details
      let output = `✅ Tokens unstaked successfully!
Transaction: ${result.txId}

UNSTAKING SUMMARY:
Original Amount: ${details.originalAmount} tokens
Rewards Earned: ${details.rewards} tokens`

      if (details.penalty > 0) {
        output += `
Early Withdrawal Penalty: ${details.penalty} tokens`
      }

      output += `
Total Received: ${details.finalAmount} tokens`

      return {
        success: true,
        output,
      }
    } else {
      return result
    }
  }

  /**
   * Handle rewards command
   */
  async handleRewardsCommand(args) {
    const subcommand = args[0]
    
    if (subcommand !== 'claim') {
      return {
        success: false,
        error: 'Usage: rewards claim [stake-id]',
      }
    }

    const stakeId = args[1] || null
    const result = await this.staking.claimRewards(stakeId)

    if (result.success) {
      return {
        success: true,
        output: `✅ Rewards claimed successfully!
Transaction: ${result.txId}
Rewards Claimed: ${result.details.rewardsClaimed} tokens
Stakes Updated: ${result.details.stakesUpdated}`,
      }
    } else {
      return result
    }
  }

  /**
   * Handle staking info command
   */
  async handleStakingInfoCommand() {
    const result = await this.staking.getStakingInfo()

    if (result.success) {
      const { summary, stakes, pools } = result
      
      let output = `
╔══════════════════════════════════════════╗
║           STAKING OVERVIEW               ║
╠══════════════════════════════════════════╣
║ Total Staked: ${summary.totalStaked} tokens
║ Total Rewards: ${summary.totalRewards} tokens
║ Pending Rewards: ${summary.totalPendingRewards} tokens
║ Active Stakes: ${summary.activeStakes}
╚══════════════════════════════════════════╝`

      if (stakes.length > 0) {
        output += `

YOUR STAKES:
${stakes.map((stake, index) => `
[${index + 1}] Stake ID: ${stake.id}
    Amount: ${stake.amount} tokens
    Pool: ${stake.poolId} (${stake.apy}% APY)
    Status: ${stake.status}
    Locked: ${stake.isLocked ? `Yes (until ${new Date(stake.unlockTime).toLocaleDateString()})` : 'No'}
    Rewards: ${stake.rewards} earned, ${stake.pendingRewards} pending
    Daily Reward: ${stake.dailyReward} tokens
`).join('')}`
      }

      output += `

AVAILABLE POOLS:
${pools.map(pool => `
${pool.name} Pool:
  APY: ${pool.apy}%
  Lock Period: ${pool.lockDays === 0 ? 'Flexible' : `${pool.lockDays} days`}
  Min Stake: ${pool.minStake} tokens
  Total Staked: ${pool.totalStaked} tokens
  Participants: ${pool.participants}
`).join('')}`

      return {
        success: true,
        output,
      }
    } else {
      return result
    }
  }

  /**
   * Handle balance command
   */
  async handleBalanceCommand(args) {
    if (!this.wallet.publicKey) {
      return {
        success: false,
        error: ERRORS.WALLET_NOT_CONNECTED,
      }
    }

    try {
      // Get SOL balance
      const solBalance = await this.connection.getBalance(this.wallet.publicKey)
      const solAmount = solBalance / 1e9

      // Get token balances (simplified - in production would fetch all SPL tokens)
      let output = `
╔══════════════════════════════════════════╗
║           WALLET BALANCE                 ║
╠══════════════════════════════════════════╣
║ Address: ${this.wallet.publicKey.toString()}
║
║ BALANCES:
║ SOL: ${solAmount.toFixed(9)}
`

      // Add token balances here when available
      output += `╚══════════════════════════════════════════╝`

      return {
        success: true,
        output,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || ERRORS.NETWORK_ERROR,
      }
    }
  }

  /**
   * Handle history command
   */
  async handleHistoryCommand(args) {
    const limit = parseInt(args[0]) || 10

    try {
      const signatures = await this.connection.getSignaturesForAddress(
        this.wallet.publicKey,
        { limit }
      )

      if (signatures.length === 0) {
        return {
          success: true,
          output: 'No transaction history found.',
        }
      }

      const history = signatures.map((sig, index) => `
[${index + 1}] ${sig.signature.slice(0, 20)}...
    Slot: ${sig.slot}
    Time: ${new Date(sig.blockTime * 1000).toLocaleString()}
    Status: ${sig.err ? 'Failed' : 'Success'}
`).join('')

      return {
        success: true,
        output: `Recent Transactions (${signatures.length}):${history}`,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || ERRORS.NETWORK_ERROR,
      }
    }
  }

  // Helper methods
  
  formatDuration(seconds) {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    const parts = []
    if (days > 0) parts.push(`${days}d`)
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    if (secs > 0) parts.push(`${secs}s`)

    return parts.join(' ')
  }
}

export default CommandParser