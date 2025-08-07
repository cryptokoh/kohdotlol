// Solana Service for koH Labs Terminal
// Handles all Solana blockchain interactions, token data, and transactions

import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID, AccountLayout } from '@solana/spl-token';
import { Jupiter, RouteInfo } from '@jup-ag/core';
import axios from 'axios';

export interface TokenInfo {
  mint: string;
  name: string;
  symbol: string;
  decimals: number;
  supply: number;
  logoURI?: string;
  tags?: string[];
  verified: boolean;
}

export interface TokenBalance {
  mint: string;
  amount: number;
  decimals: number;
  uiAmount: number;
  symbol?: string;
  name?: string;
}

export interface WalletInfo {
  address: string;
  solBalance: number;
  tokenBalances: TokenBalance[];
  totalValueUsd: number;
}

export interface SwapQuote {
  inputMint: string;
  outputMint: string;
  inputAmount: number;
  outputAmount: number;
  priceImpact: number;
  marketPrice: number;
  routes: RouteInfo[];
}

export interface TransactionResult {
  signature: string;
  success: boolean;
  error?: string;
  gasUsed?: number;
  confirmations?: number;
}

export class SolanaService {
  private connection: Connection;
  private jupiter: Jupiter | null = null;
  private tokenListCache: Map<string, TokenInfo> = new Map();
  private tokenListLastUpdate: number = 0;
  private readonly TOKEN_LIST_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    const rpcEndpoint = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    this.connection = new Connection(rpcEndpoint, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000
    });
    
    this.initializeJupiter();
    this.loadTokenList();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  private async initializeJupiter() {
    try {
      this.jupiter = await Jupiter.load({
        connection: this.connection,
        cluster: 'mainnet-beta',
        user: new PublicKey('11111111111111111111111111111111') // Placeholder
      });
      console.log('Jupiter initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Jupiter:', error);
    }
  }

  private async loadTokenList() {
    try {
      const response = await axios.get('https://token.jup.ag/strict');
      const tokens = response.data as any[];
      
      this.tokenListCache.clear();
      tokens.forEach(token => {
        this.tokenListCache.set(token.address, {
          mint: token.address,
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          supply: 0, // Will be fetched separately if needed
          logoURI: token.logoURI,
          tags: token.tags,
          verified: true
        });
      });
      
      this.tokenListLastUpdate = Date.now();
      console.log(`Loaded ${tokens.length} tokens from Jupiter token list`);
    } catch (error) {
      console.error('Failed to load token list:', error);
    }
  }

  // ============================================================================
  // TOKEN INFORMATION
  // ============================================================================

  async getTokenInfo(mintAddress: string): Promise<TokenInfo> {
    // Check cache first
    if (this.shouldRefreshTokenList()) {
      await this.loadTokenList();
    }

    const cached = this.tokenListCache.get(mintAddress);
    if (cached) {
      // Fetch current supply
      cached.supply = await this.getTokenSupply(mintAddress);
      return cached;
    }

    // Fetch token info from chain if not in cache
    try {
      const mintPublicKey = new PublicKey(mintAddress);
      const mintAccount = await this.connection.getParsedAccountInfo(mintPublicKey);
      
      if (!mintAccount.value?.data || typeof mintAccount.value.data === 'string') {
        throw new Error('Invalid token mint address');
      }

      const mintData = (mintAccount.value.data as any).parsed.info;
      
      return {
        mint: mintAddress,
        name: `Unknown Token (${mintAddress.slice(0, 8)}...)`,
        symbol: 'UNKNOWN',
        decimals: mintData.decimals,
        supply: parseInt(mintData.supply),
        verified: false
      };
    } catch (error) {
      throw new Error(`Failed to fetch token info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTokenSupply(mintAddress: string): Promise<number> {
    try {
      const supply = await this.connection.getTokenSupply(new PublicKey(mintAddress));
      return parseInt(supply.value.amount);
    } catch (error) {
      console.error(`Failed to get token supply for ${mintAddress}:`, error);
      return 0;
    }
  }

  async getTokenPrice(mintAddress: string): Promise<{ price: number; change24h: number; volume24h: number }> {
    try {
      // Use Jupiter price API
      const response = await axios.get(`https://price.jup.ag/v4/price?ids=${mintAddress}`);
      const priceData = response.data.data[mintAddress];
      
      if (!priceData) {
        throw new Error('Price data not available');
      }

      return {
        price: priceData.price,
        change24h: priceData.priceChange24h || 0,
        volume24h: priceData.volume24h || 0
      };
    } catch (error) {
      console.error(`Failed to get price for ${mintAddress}:`, error);
      return { price: 0, change24h: 0, volume24h: 0 };
    }
  }

  // ============================================================================
  // WALLET OPERATIONS
  // ============================================================================

  async getWalletInfo(walletAddress: string): Promise<WalletInfo> {
    try {
      const publicKey = new PublicKey(walletAddress);
      
      // Get SOL balance
      const solBalance = await this.connection.getBalance(publicKey);
      
      // Get token accounts
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      const tokenBalances: TokenBalance[] = [];
      let totalValueUsd = solBalance / LAMPORTS_PER_SOL * await this.getSolPrice();

      for (const tokenAccount of tokenAccounts.value) {
        const accountData = tokenAccount.account.data.parsed.info;
        const mint = accountData.mint;
        const amount = parseInt(accountData.tokenAmount.amount);
        const decimals = accountData.tokenAmount.decimals;
        const uiAmount = accountData.tokenAmount.uiAmount;

        if (uiAmount > 0) {
          const tokenInfo = await this.getTokenInfo(mint).catch(() => null);
          const priceInfo = await this.getTokenPrice(mint).catch(() => ({ price: 0, change24h: 0, volume24h: 0 }));
          
          tokenBalances.push({
            mint,
            amount,
            decimals,
            uiAmount,
            symbol: tokenInfo?.symbol,
            name: tokenInfo?.name
          });

          totalValueUsd += uiAmount * priceInfo.price;
        }
      }

      return {
        address: walletAddress,
        solBalance: solBalance / LAMPORTS_PER_SOL,
        tokenBalances,
        totalValueUsd
      };

    } catch (error) {
      throw new Error(`Failed to get wallet info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async getSolPrice(): Promise<number> {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      return response.data.solana.usd;
    } catch (error) {
      console.error('Failed to get SOL price:', error);
      return 0;
    }
  }

  // ============================================================================
  // SWAP OPERATIONS (Jupiter Integration)
  // ============================================================================

  async getSwapQuote(
    inputMint: string,
    outputMint: string,
    inputAmount: number
  ): Promise<SwapQuote> {
    if (!this.jupiter) {
      throw new Error('Jupiter not initialized');
    }

    try {
      const routes = await this.jupiter.computeRoutes({
        inputMint: new PublicKey(inputMint),
        outputMint: new PublicKey(outputMint),
        inputAmount,
        slippage: 3 // 3% slippage tolerance
      });

      if (routes.routesInfos.length === 0) {
        throw new Error('No swap routes found');
      }

      const bestRoute = routes.routesInfos[0];
      
      return {
        inputMint,
        outputMint,
        inputAmount,
        outputAmount: bestRoute.outAmount,
        priceImpact: bestRoute.priceImpactPct,
        marketPrice: bestRoute.outAmount / inputAmount,
        routes: routes.routesInfos
      };

    } catch (error) {
      throw new Error(`Failed to get swap quote: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async simulateSwap(
    userWallet: string,
    inputMint: string,
    outputMint: string,
    inputAmount: number
  ): Promise<{ success: boolean; outputAmount?: number; error?: string; gasEstimate?: number }> {
    try {
      const quote = await this.getSwapQuote(inputMint, outputMint, inputAmount);
      
      if (!this.jupiter) {
        throw new Error('Jupiter not initialized');
      }

      const { execute } = await this.jupiter.exchange({
        routeInfo: quote.routes[0],
        userPublicKey: new PublicKey(userWallet)
      });

      // Simulate the transaction
      const transaction = await execute();
      const simulation = await this.connection.simulateTransaction(transaction as Transaction);

      if (simulation.value.err) {
        return {
          success: false,
          error: `Simulation failed: ${simulation.value.err}`
        };
      }

      return {
        success: true,
        outputAmount: quote.outputAmount,
        gasEstimate: simulation.value.unitsConsumed || 200000
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Simulation failed'
      };
    }
  }

  // ============================================================================
  // TRANSACTION OPERATIONS
  // ============================================================================

  async executeSwap(
    userWallet: string,
    inputMint: string,
    outputMint: string,
    inputAmount: number,
    privateKey?: string // For dangerous mode operations
  ): Promise<TransactionResult> {
    if (!privateKey) {
      throw new Error('Private key required for transaction execution');
    }

    try {
      const quote = await this.getSwapQuote(inputMint, outputMint, inputAmount);
      
      if (!this.jupiter) {
        throw new Error('Jupiter not initialized');
      }

      const { execute } = await this.jupiter.exchange({
        routeInfo: quote.routes[0],
        userPublicKey: new PublicKey(userWallet)
      });

      const transaction = await execute();
      
      // Sign and send transaction
      // Note: In production, this would use a secure key management system
      const signature = await this.connection.sendTransaction(transaction as Transaction);
      
      // Wait for confirmation
      const confirmation = await this.connection.confirmTransaction(signature, 'confirmed');
      
      return {
        signature,
        success: !confirmation.value.err,
        error: confirmation.value.err ? String(confirmation.value.err) : undefined,
        confirmations: 1
      };

    } catch (error) {
      return {
        signature: '',
        success: false,
        error: error instanceof Error ? error.message : 'Transaction failed'
      };
    }
  }

  async getTransactionStatus(signature: string): Promise<{
    confirmed: boolean;
    confirmations: number;
    error?: string;
  }> {
    try {
      const status = await this.connection.getSignatureStatus(signature);
      
      return {
        confirmed: status.value?.confirmationStatus === 'confirmed' || status.value?.confirmationStatus === 'finalized',
        confirmations: status.value?.confirmations || 0,
        error: status.value?.err ? String(status.value.err) : undefined
      };
    } catch (error) {
      return {
        confirmed: false,
        confirmations: 0,
        error: error instanceof Error ? error.message : 'Failed to check status'
      };
    }
  }

  // ============================================================================
  // TOKEN DISCOVERY
  // ============================================================================

  async searchTokens(query: string, limit: number = 10): Promise<TokenInfo[]> {
    if (this.shouldRefreshTokenList()) {
      await this.loadTokenList();
    }

    const results: TokenInfo[] = [];
    const queryLower = query.toLowerCase();

    for (const token of this.tokenListCache.values()) {
      if (results.length >= limit) break;
      
      if (
        token.symbol.toLowerCase().includes(queryLower) ||
        token.name.toLowerCase().includes(queryLower) ||
        token.mint.toLowerCase().includes(queryLower)
      ) {
        results.push(token);
      }
    }

    return results;
  }

  async getTrendingTokens(limit: number = 20): Promise<TokenInfo[]> {
    try {
      // This would integrate with a trending tokens API
      // For now, return popular tokens from cache
      const popular = ['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v']; // USDC
      
      const results: TokenInfo[] = [];
      for (const mint of popular) {
        if (results.length >= limit) break;
        try {
          const tokenInfo = await this.getTokenInfo(mint);
          results.push(tokenInfo);
        } catch (error) {
          // Skip tokens that fail to load
        }
      }
      
      return results;
    } catch (error) {
      console.error('Failed to get trending tokens:', error);
      return [];
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private shouldRefreshTokenList(): boolean {
    return Date.now() - this.tokenListLastUpdate > this.TOKEN_LIST_CACHE_DURATION;
  }

  async validateAddress(address: string): Promise<boolean> {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  formatTokenAmount(amount: number, decimals: number): string {
    const formatted = (amount / Math.pow(10, decimals)).toFixed(6);
    return parseFloat(formatted).toString();
  }

  async getAccountInfo(address: string) {
    try {
      return await this.connection.getAccountInfo(new PublicKey(address));
    } catch (error) {
      return null;
    }
  }

  async getRecentTransactions(address: string, limit: number = 10) {
    try {
      const signatures = await this.connection.getSignaturesForAddress(
        new PublicKey(address),
        { limit }
      );

      const transactions = await Promise.all(
        signatures.map(sig => this.connection.getParsedTransaction(sig.signature))
      );

      return transactions.filter(tx => tx !== null);
    } catch (error) {
      console.error('Failed to get recent transactions:', error);
      return [];
    }
  }
}

export default SolanaService;