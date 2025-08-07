// Streamflow Finance SDK Integration Service
import {
  GenericStreamClient,
  getBN,
  getNumberFromBN,
  StreamType,
  IChain,
  StreamflowSolana,
} from '@streamflow/stream'
import { PublicKey, Connection, Transaction } from '@solana/web3.js'
import { STREAM_CONFIG, ERRORS, SUCCESS } from '../constants'

export class StreamflowService {
  constructor(connection, wallet) {
    this.connection = connection
    this.wallet = wallet
    this.client = null
    this.initialized = false
  }

  /**
   * Initialize Streamflow client
   */
  async initialize() {
    try {
      const cluster = await this.getCluster()
      this.client = new GenericStreamClient({
        chain: IChain.Solana,
        clusterUrl: this.connection.rpcEndpoint,
        cluster,
        programId: StreamflowSolana.PROGRAM_ID.toBase58(),
        wallet: this.wallet,
      })
      this.initialized = true
      return true
    } catch (error) {
      console.error('Failed to initialize Streamflow client:', error)
      return false
    }
  }

  /**
   * Get the appropriate cluster based on RPC endpoint
   */
  async getCluster() {
    const endpoint = this.connection.rpcEndpoint
    if (endpoint.includes('devnet')) return 'devnet'
    if (endpoint.includes('testnet')) return 'testnet'
    return 'mainnet-beta'
  }

  /**
   * Create a payment stream
   */
  async createStream({
    recipient,
    amount,
    tokenMint,
    duration,
    name = 'koHLabs Stream',
    cliff = 0,
    releaseFrequency = STREAM_CONFIG.RELEASE_FREQUENCY,
    canCancel = true,
    canTransfer = true,
  }) {
    if (!this.initialized) await this.initialize()
    if (!this.wallet.publicKey) throw new Error(ERRORS.WALLET_NOT_CONNECTED)

    try {
      // Validate inputs
      const recipientPubkey = new PublicKey(recipient)
      const mintPubkey = new PublicKey(tokenMint)
      
      // Calculate stream parameters
      const now = Math.floor(Date.now() / 1000)
      const startTime = now + cliff
      const endTime = startTime + duration
      const depositAmount = getBN(amount, 9) // Assuming 9 decimals
      
      // Create stream metadata
      const streamParams = {
        recipient: recipientPubkey.toBase58(),
        mint: mintPubkey.toBase58(),
        start: startTime,
        depositedAmount: depositAmount,
        period: releaseFrequency,
        cliff: startTime,
        cliffAmount: getBN(0, 9),
        amountPerPeriod: depositAmount.div(getBN(duration / releaseFrequency, 0)),
        name,
        canTopup: false,
        cancelableBySender: canCancel,
        cancelableByRecipient: false,
        transferableBySender: canTransfer,
        transferableByRecipient: false,
        automaticWithdrawal: true,
        withdrawalFrequency: releaseFrequency,
        partner: null,
      }

      // Create the stream
      const { txId, stream } = await this.client.create(streamParams)
      
      return {
        success: true,
        txId,
        streamId: stream.id,
        message: SUCCESS.STREAM_CREATED,
        details: {
          recipient: recipientPubkey.toBase58(),
          amount: getNumberFromBN(depositAmount, 9),
          duration,
          startTime: new Date(startTime * 1000).toISOString(),
          endTime: new Date(endTime * 1000).toISOString(),
        },
      }
    } catch (error) {
      console.error('Stream creation failed:', error)
      return {
        success: false,
        error: error.message || ERRORS.TRANSACTION_FAILED,
      }
    }
  }

  /**
   * Create a vesting schedule
   */
  async createVesting({
    recipient,
    totalAmount,
    tokenMint,
    cliffDuration,
    vestingDuration,
    name = 'koHLabs Vesting',
  }) {
    if (!this.initialized) await this.initialize()
    if (!this.wallet.publicKey) throw new Error(ERRORS.WALLET_NOT_CONNECTED)

    try {
      const recipientPubkey = new PublicKey(recipient)
      const mintPubkey = new PublicKey(tokenMint)
      
      const now = Math.floor(Date.now() / 1000)
      const cliffTime = now + cliffDuration
      const endTime = now + vestingDuration
      const depositAmount = getBN(totalAmount, 9)
      
      // Calculate cliff amount (typically 25% of total)
      const cliffPercentage = 0.25
      const cliffAmount = depositAmount.mul(getBN(cliffPercentage * 1e9, 0)).div(getBN(1e9, 0))
      const remainingAmount = depositAmount.sub(cliffAmount)
      const vestingPeriod = vestingDuration - cliffDuration
      
      const vestingParams = {
        recipient: recipientPubkey.toBase58(),
        mint: mintPubkey.toBase58(),
        start: now,
        depositedAmount: depositAmount,
        period: STREAM_CONFIG.RELEASE_FREQUENCY,
        cliff: cliffTime,
        cliffAmount,
        amountPerPeriod: remainingAmount.div(getBN(vestingPeriod / STREAM_CONFIG.RELEASE_FREQUENCY, 0)),
        name,
        canTopup: false,
        cancelableBySender: false,
        cancelableByRecipient: false,
        transferableBySender: false,
        transferableByRecipient: true,
        automaticWithdrawal: true,
        withdrawalFrequency: 86400, // Daily automatic withdrawals
        partner: null,
      }

      const { txId, stream } = await this.client.create(vestingParams)
      
      return {
        success: true,
        txId,
        streamId: stream.id,
        message: 'Vesting schedule created successfully',
        details: {
          recipient: recipientPubkey.toBase58(),
          totalAmount: getNumberFromBN(depositAmount, 9),
          cliffAmount: getNumberFromBN(cliffAmount, 9),
          cliffDate: new Date(cliffTime * 1000).toISOString(),
          vestingEnd: new Date(endTime * 1000).toISOString(),
        },
      }
    } catch (error) {
      console.error('Vesting creation failed:', error)
      return {
        success: false,
        error: error.message || ERRORS.TRANSACTION_FAILED,
      }
    }
  }

  /**
   * Cancel a stream
   */
  async cancelStream(streamId) {
    if (!this.initialized) await this.initialize()
    if (!this.wallet.publicKey) throw new Error(ERRORS.WALLET_NOT_CONNECTED)

    try {
      const { txId } = await this.client.cancel({ id: streamId })
      
      return {
        success: true,
        txId,
        message: SUCCESS.STREAM_CANCELLED,
      }
    } catch (error) {
      console.error('Stream cancellation failed:', error)
      return {
        success: false,
        error: error.message || ERRORS.TRANSACTION_FAILED,
      }
    }
  }

  /**
   * Get stream information
   */
  async getStreamInfo(streamId) {
    if (!this.initialized) await this.initialize()

    try {
      const stream = await this.client.getOne({ id: streamId })
      
      if (!stream) {
        return {
          success: false,
          error: ERRORS.STREAM_NOT_FOUND,
        }
      }

      const now = Math.floor(Date.now() / 1000)
      const elapsed = Math.max(0, now - stream.start)
      const totalDuration = stream.end - stream.start
      const progress = Math.min(100, (elapsed / totalDuration) * 100)
      
      const withdrawn = getNumberFromBN(stream.withdrawnAmount, 9)
      const deposited = getNumberFromBN(stream.depositedAmount, 9)
      const available = await this.calculateAvailable(stream, now)
      
      return {
        success: true,
        stream: {
          id: stream.id,
          name: stream.name,
          recipient: stream.recipient,
          sender: stream.sender,
          mint: stream.mint,
          status: this.getStreamStatus(stream, now),
          progress: progress.toFixed(2),
          deposited,
          withdrawn,
          available,
          remaining: deposited - withdrawn,
          startTime: new Date(stream.start * 1000).toISOString(),
          endTime: new Date(stream.end * 1000).toISOString(),
          cancelable: stream.cancelableBySender || stream.cancelableByRecipient,
          transferable: stream.transferableBySender || stream.transferableByRecipient,
        },
      }
    } catch (error) {
      console.error('Failed to get stream info:', error)
      return {
        success: false,
        error: error.message || ERRORS.NETWORK_ERROR,
      }
    }
  }

  /**
   * List all streams for the connected wallet
   */
  async listStreams(direction = 'all') {
    if (!this.initialized) await this.initialize()
    if (!this.wallet.publicKey) throw new Error(ERRORS.WALLET_NOT_CONNECTED)

    try {
      const address = this.wallet.publicKey.toBase58()
      let streamEntries = []

      // Get all streams for the wallet
      const allStreams = await this.client.get({
        address,
      })

      // Filter based on direction if needed
      allStreams.forEach(([id, stream]) => {
        if (direction === 'all' || 
            (direction === 'outgoing' && stream.sender === address) ||
            (direction === 'incoming' && stream.recipient === address)) {
          streamEntries.push({ id, ...stream })
        }
      })

      const now = Math.floor(Date.now() / 1000)
      
      return {
        success: true,
        streams: streamEntries.map(stream => ({
          id: stream.id,
          name: stream.name,
          type: stream.sender === address ? 'outgoing' : 'incoming',
          status: this.getStreamStatus(stream, now),
          counterparty: stream.sender === address ? stream.recipient : stream.sender,
          amount: getNumberFromBN(stream.depositedAmount, 9),
          progress: this.calculateProgress(stream, now),
          startTime: new Date(stream.start * 1000).toISOString(),
          endTime: new Date(stream.end * 1000).toISOString(),
        })),
      }
    } catch (error) {
      console.error('Failed to list streams:', error)
      return {
        success: false,
        error: error.message || ERRORS.NETWORK_ERROR,
      }
    }
  }

  /**
   * Withdraw available funds from a stream
   */
  async withdrawFromStream(streamId, amount = null) {
    if (!this.initialized) await this.initialize()
    if (!this.wallet.publicKey) throw new Error(ERRORS.WALLET_NOT_CONNECTED)

    try {
      const withdrawParams = {
        id: streamId,
      }

      if (amount !== null) {
        withdrawParams.amount = getBN(amount, 9)
      }

      const { txId } = await this.client.withdraw(withdrawParams)
      
      return {
        success: true,
        txId,
        message: 'Withdrawal successful',
      }
    } catch (error) {
      console.error('Withdrawal failed:', error)
      return {
        success: false,
        error: error.message || ERRORS.TRANSACTION_FAILED,
      }
    }
  }

  /**
   * Transfer stream ownership
   */
  async transferStream(streamId, newRecipient) {
    if (!this.initialized) await this.initialize()
    if (!this.wallet.publicKey) throw new Error(ERRORS.WALLET_NOT_CONNECTED)

    try {
      const newRecipientPubkey = new PublicKey(newRecipient)
      
      const { txId } = await this.client.transfer({
        id: streamId,
        newRecipient: newRecipientPubkey.toBase58(),
      })
      
      return {
        success: true,
        txId,
        message: 'Stream transferred successfully',
      }
    } catch (error) {
      console.error('Transfer failed:', error)
      return {
        success: false,
        error: error.message || ERRORS.TRANSACTION_FAILED,
      }
    }
  }

  /**
   * Top up an existing stream with additional funds
   */
  async topUpStream(streamId, amount) {
    if (!this.initialized) await this.initialize()
    if (!this.wallet.publicKey) throw new Error(ERRORS.WALLET_NOT_CONNECTED)

    try {
      const { txId } = await this.client.topup({
        id: streamId,
        amount: getBN(amount, 9),
      })
      
      return {
        success: true,
        txId,
        message: 'Stream topped up successfully',
      }
    } catch (error) {
      console.error('Top up failed:', error)
      return {
        success: false,
        error: error.message || ERRORS.TRANSACTION_FAILED,
      }
    }
  }

  // Helper methods
  
  getStreamStatus(stream, now) {
    if (stream.canceledAt) return 'cancelled'
    if (now < stream.start) return 'scheduled'
    if (now >= stream.end) return 'completed'
    return 'active'
  }

  calculateProgress(stream, now) {
    if (now < stream.start) return 0
    if (now >= stream.end) return 100
    const elapsed = now - stream.start
    const total = stream.end - stream.start
    return Math.floor((elapsed / total) * 100)
  }

  async calculateAvailable(stream, now) {
    if (now < stream.start) return 0
    
    const elapsed = Math.min(now - stream.start, stream.end - stream.start)
    const totalDuration = stream.end - stream.start
    const totalAmount = getNumberFromBN(stream.depositedAmount, 9)
    const withdrawn = getNumberFromBN(stream.withdrawnAmount, 9)
    
    const unlocked = (totalAmount * elapsed) / totalDuration
    return Math.max(0, unlocked - withdrawn)
  }
}

export default StreamflowService