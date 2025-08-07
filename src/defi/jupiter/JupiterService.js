// Jupiter Aggregator Service for Token Swapping
import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js'
import axios from 'axios'
import { JUPITER_CONFIG, ERRORS, SUCCESS } from '../constants'

export class JupiterService {
  constructor(connection, wallet) {
    this.connection = connection
    this.wallet = wallet
    this.apiUrl = JUPITER_CONFIG.API_URL
  }

  /**
   * Get a swap quote from Jupiter
   */
  async getQuote({
    inputMint,
    outputMint,
    amount,
    slippageBps = JUPITER_CONFIG.DEFAULT_SLIPPAGE,
    onlyDirectRoutes = false,
  }) {
    try {
      const params = {
        inputMint: inputMint.toString(),
        outputMint: outputMint.toString(),
        amount: amount.toString(),
        slippageBps,
        onlyDirectRoutes,
        asLegacyTransaction: false,
      }

      const response = await axios.get(`${this.apiUrl}/quote`, { params })
      const quote = response.data

      if (!quote) {
        throw new Error('No routes found for this swap')
      }

      return {
        success: true,
        quote: {
          inputAmount: quote.inAmount,
          outputAmount: quote.outAmount,
          priceImpactPct: quote.priceImpactPct,
          marketInfos: quote.routePlan?.map(route => ({
            label: route.swapInfo?.label,
            inputMint: route.swapInfo?.inputMint,
            outputMint: route.swapInfo?.outputMint,
            inAmount: route.swapInfo?.inAmount,
            outAmount: route.swapInfo?.outAmount,
            feeAmount: route.swapInfo?.feeAmount,
            feeMint: route.swapInfo?.feeMint,
          })),
          otherAmountThreshold: quote.otherAmountThreshold,
          swapMode: quote.swapMode,
        },
      }
    } catch (error) {
      console.error('Failed to get quote:', error)
      return {
        success: false,
        error: error.message || 'Failed to get swap quote',
      }
    }
  }

  /**
   * Execute a swap using Jupiter
   */
  async executeSwap({
    inputMint,
    outputMint,
    amount,
    slippageBps = JUPITER_CONFIG.DEFAULT_SLIPPAGE,
    userPublicKey = null,
  }) {
    if (!this.wallet.publicKey) {
      return {
        success: false,
        error: ERRORS.WALLET_NOT_CONNECTED,
      }
    }

    try {
      // Step 1: Get quote
      const quoteResponse = await this.getQuote({
        inputMint,
        outputMint,
        amount,
        slippageBps,
      })

      if (!quoteResponse.success) {
        return quoteResponse
      }

      const quote = quoteResponse.quote

      // Step 2: Get swap transaction
      const swapResponse = await axios.post(`${this.apiUrl}/swap`, {
        quoteResponse: quote,
        userPublicKey: (userPublicKey || this.wallet.publicKey).toString(),
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: {
          priorityLevelWithMaxLamports: {
            maxLamports: Math.floor(JUPITER_CONFIG.PRIORITY_FEE * 1e9),
            priorityLevel: 'high',
          },
        },
      })

      const { swapTransaction } = swapResponse.data

      // Step 3: Deserialize and sign transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64')
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf)

      // Sign transaction
      const signedTransaction = await this.wallet.signTransaction(transaction)

      // Step 4: Send and confirm transaction
      const rawTransaction = signedTransaction.serialize()
      const txid = await this.connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      })

      // Wait for confirmation
      const latestBlockHash = await this.connection.getLatestBlockhash()
      await this.connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid,
      })

      return {
        success: true,
        txId: txid,
        message: SUCCESS.SWAP_COMPLETED,
        details: {
          inputAmount: quote.inputAmount,
          outputAmount: quote.outputAmount,
          priceImpactPct: quote.priceImpactPct,
        },
      }
    } catch (error) {
      console.error('Swap execution failed:', error)
      return {
        success: false,
        error: error.message || ERRORS.TRANSACTION_FAILED,
      }
    }
  }

  /**
   * Get token price in USDC
   */
  async getTokenPrice(tokenMint) {
    try {
      // Use USDC as the quote currency
      const usdcMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
      const amount = 1e9 // 1 token with 9 decimals

      const quoteResponse = await this.getQuote({
        inputMint: tokenMint,
        outputMint: usdcMint,
        amount,
      })

      if (!quoteResponse.success) {
        return {
          success: false,
          error: 'Failed to get price',
        }
      }

      const price = (parseFloat(quoteResponse.quote.outputAmount) / 1e6) // USDC has 6 decimals
      
      return {
        success: true,
        price,
        priceFormatted: `$${price.toFixed(6)}`,
      }
    } catch (error) {
      console.error('Failed to get token price:', error)
      return {
        success: false,
        error: error.message || 'Failed to get price',
      }
    }
  }

  /**
   * Calculate price impact for a swap
   */
  async calculatePriceImpact({
    inputMint,
    outputMint,
    amount,
  }) {
    try {
      // Get quote for the actual amount
      const actualQuote = await this.getQuote({
        inputMint,
        outputMint,
        amount,
      })

      if (!actualQuote.success) {
        return actualQuote
      }

      // Get quote for a small amount to determine base price
      const smallAmount = 1e6 // Small amount to minimize price impact
      const baseQuote = await this.getQuote({
        inputMint,
        outputMint,
        amount: smallAmount,
      })

      if (!baseQuote.success) {
        return baseQuote
      }

      // Calculate the expected output based on base price
      const baseRate = parseFloat(baseQuote.quote.outputAmount) / parseFloat(baseQuote.quote.inputAmount)
      const expectedOutput = parseFloat(amount) * baseRate
      const actualOutput = parseFloat(actualQuote.quote.outputAmount)
      
      // Calculate price impact
      const priceImpact = ((expectedOutput - actualOutput) / expectedOutput) * 100

      return {
        success: true,
        priceImpact: priceImpact.toFixed(4),
        actualOutput,
        expectedOutput,
        slippage: actualQuote.quote.priceImpactPct,
        warning: priceImpact > 5 ? 'High price impact detected!' : null,
      }
    } catch (error) {
      console.error('Failed to calculate price impact:', error)
      return {
        success: false,
        error: error.message || 'Failed to calculate price impact',
      }
    }
  }

  /**
   * Get available routes for a swap pair
   */
  async getSwapRoutes({
    inputMint,
    outputMint,
    amount,
  }) {
    try {
      const response = await axios.get(`${this.apiUrl}/quote`, {
        params: {
          inputMint: inputMint.toString(),
          outputMint: outputMint.toString(),
          amount: amount.toString(),
          swapMode: 'ExactIn',
          onlyDirectRoutes: false,
        },
      })

      if (!response.data) {
        return {
          success: false,
          error: 'No routes found',
        }
      }

      const routes = response.data.routePlan || []
      
      return {
        success: true,
        routes: routes.map((route, index) => ({
          index,
          label: route.swapInfo?.label || 'Unknown',
          percent: route.percent,
          inAmount: route.swapInfo?.inAmount,
          outAmount: route.swapInfo?.outAmount,
          marketInfo: {
            id: route.swapInfo?.ammKey,
            label: route.swapInfo?.label,
            fee: route.swapInfo?.feeAmount,
          },
        })),
        totalOutput: response.data.outAmount,
        priceImpact: response.data.priceImpactPct,
      }
    } catch (error) {
      console.error('Failed to get swap routes:', error)
      return {
        success: false,
        error: error.message || 'Failed to get routes',
      }
    }
  }

  /**
   * Simulate a swap transaction
   */
  async simulateSwap({
    inputMint,
    outputMint,
    amount,
    slippageBps = JUPITER_CONFIG.DEFAULT_SLIPPAGE,
  }) {
    if (!this.wallet.publicKey) {
      return {
        success: false,
        error: ERRORS.WALLET_NOT_CONNECTED,
      }
    }

    try {
      // Get quote
      const quoteResponse = await this.getQuote({
        inputMint,
        outputMint,
        amount,
        slippageBps,
      })

      if (!quoteResponse.success) {
        return quoteResponse
      }

      // Get swap transaction
      const swapResponse = await axios.post(`${this.apiUrl}/swap`, {
        quoteResponse: quoteResponse.quote,
        userPublicKey: this.wallet.publicKey.toString(),
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
      })

      const { swapTransaction } = swapResponse.data
      
      // Deserialize transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64')
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf)

      // Simulate transaction
      const simulation = await this.connection.simulateTransaction(transaction)

      return {
        success: !simulation.value.err,
        simulation: {
          error: simulation.value.err,
          logs: simulation.value.logs,
          unitsConsumed: simulation.value.unitsConsumed,
        },
        quote: quoteResponse.quote,
      }
    } catch (error) {
      console.error('Swap simulation failed:', error)
      return {
        success: false,
        error: error.message || 'Simulation failed',
      }
    }
  }
}

export default JupiterService