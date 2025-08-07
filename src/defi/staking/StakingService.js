// Staking Service for koHLabs Token
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { STAKING_CONFIG, ERRORS, SUCCESS } from '../constants'

export class StakingService {
  constructor(connection, wallet) {
    this.connection = connection
    this.wallet = wallet
    this.stakingPools = new Map() // Store active staking pools
    this.userStakes = new Map() // Store user stakes
  }

  /**
   * Initialize staking pools (would be on-chain in production)
   */
  async initializePools() {
    // In production, this would fetch from on-chain program
    Object.entries(STAKING_CONFIG.LOCK_PERIODS).forEach(([key, config]) => {
      this.stakingPools.set(key, {
        id: key,
        name: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
        lockDays: config.days,
        apy: config.apy,
        totalStaked: 0,
        participants: 0,
        minStake: STAKING_CONFIG.MIN_STAKE,
        active: true,
      })
    })
  }

  /**
   * Stake tokens in a pool
   */
  async stakeTokens({
    amount,
    poolId = 'FLEXIBLE',
    tokenMint,
  }) {
    if (!this.wallet.publicKey) {
      return {
        success: false,
        error: ERRORS.WALLET_NOT_CONNECTED,
      }
    }

    try {
      const pool = this.stakingPools.get(poolId)
      if (!pool) {
        return {
          success: false,
          error: 'Invalid staking pool',
        }
      }

      if (amount < pool.minStake) {
        return {
          success: false,
          error: `Minimum stake amount is ${pool.minStake} tokens`,
        }
      }

      // Check user balance
      const balance = await this.getUserTokenBalance(tokenMint)
      if (balance < amount) {
        return {
          success: false,
          error: ERRORS.INSUFFICIENT_BALANCE,
        }
      }

      // Create staking record
      const stakeId = this.generateStakeId()
      const now = Date.now()
      const unlockTime = now + (pool.lockDays * 24 * 60 * 60 * 1000)
      
      const stake = {
        id: stakeId,
        owner: this.wallet.publicKey.toString(),
        amount,
        poolId,
        apy: pool.apy,
        stakedAt: now,
        unlockTime,
        lastRewardClaim: now,
        rewards: 0,
        status: 'active',
      }

      // In production, this would be an on-chain transaction
      // For now, we'll simulate it
      const tx = new Transaction()
      
      // Add instruction to transfer tokens to staking pool
      // This is a simplified version - real implementation would use a staking program
      tx.add(
        SystemProgram.transfer({
          fromPubkey: this.wallet.publicKey,
          toPubkey: new PublicKey('11111111111111111111111111111111'), // Placeholder
          lamports: 5000, // Transaction fee
        })
      )

      // Sign and send transaction
      const signedTx = await this.wallet.signTransaction(tx)
      const txId = await this.connection.sendRawTransaction(signedTx.serialize())
      
      await this.connection.confirmTransaction(txId)

      // Store stake locally (in production, this would be on-chain)
      this.userStakes.set(stakeId, stake)
      
      // Update pool stats
      pool.totalStaked += amount
      pool.participants += 1

      return {
        success: true,
        txId,
        stakeId,
        message: SUCCESS.STAKE_COMPLETED,
        details: {
          amount,
          poolName: pool.name,
          lockDays: pool.lockDays,
          apy: pool.apy,
          unlockDate: new Date(unlockTime).toISOString(),
          estimatedDailyReward: this.calculateDailyReward(amount, pool.apy),
        },
      }
    } catch (error) {
      console.error('Staking failed:', error)
      return {
        success: false,
        error: error.message || ERRORS.TRANSACTION_FAILED,
      }
    }
  }

  /**
   * Unstake tokens
   */
  async unstakeTokens({
    stakeId,
    force = false,
  }) {
    if (!this.wallet.publicKey) {
      return {
        success: false,
        error: ERRORS.WALLET_NOT_CONNECTED,
      }
    }

    try {
      const stake = this.userStakes.get(stakeId)
      if (!stake) {
        return {
          success: false,
          error: 'Stake not found',
        }
      }

      if (stake.owner !== this.wallet.publicKey.toString()) {
        return {
          success: false,
          error: 'You do not own this stake',
        }
      }

      const now = Date.now()
      const isLocked = now < stake.unlockTime
      let penalty = 0
      let finalAmount = stake.amount

      if (isLocked && !force) {
        return {
          success: false,
          error: `Tokens are locked until ${new Date(stake.unlockTime).toISOString()}. Use --force flag to unstake with penalty.`,
        }
      }

      if (isLocked && force) {
        penalty = (stake.amount * STAKING_CONFIG.EARLY_WITHDRAWAL_PENALTY) / 100
        finalAmount = stake.amount - penalty
      }

      // Calculate and add unclaimed rewards
      const unclaimedRewards = this.calculateRewards(stake)
      finalAmount += unclaimedRewards

      // Create unstaking transaction
      const tx = new Transaction()
      tx.add(
        SystemProgram.transfer({
          fromPubkey: this.wallet.publicKey,
          toPubkey: new PublicKey('11111111111111111111111111111111'), // Placeholder
          lamports: 5000, // Transaction fee
        })
      )

      const signedTx = await this.wallet.signTransaction(tx)
      const txId = await this.connection.sendRawTransaction(signedTx.serialize())
      await this.connection.confirmTransaction(txId)

      // Update stake status
      stake.status = 'withdrawn'
      stake.withdrawnAt = now

      // Update pool stats
      const pool = this.stakingPools.get(stake.poolId)
      if (pool) {
        pool.totalStaked -= stake.amount
        pool.participants -= 1
      }

      return {
        success: true,
        txId,
        message: SUCCESS.UNSTAKE_COMPLETED,
        details: {
          originalAmount: stake.amount,
          rewards: unclaimedRewards,
          penalty,
          finalAmount,
          wasForced: isLocked && force,
        },
      }
    } catch (error) {
      console.error('Unstaking failed:', error)
      return {
        success: false,
        error: error.message || ERRORS.TRANSACTION_FAILED,
      }
    }
  }

  /**
   * Claim staking rewards
   */
  async claimRewards(stakeId = null) {
    if (!this.wallet.publicKey) {
      return {
        success: false,
        error: ERRORS.WALLET_NOT_CONNECTED,
      }
    }

    try {
      let stakes = []
      
      if (stakeId) {
        const stake = this.userStakes.get(stakeId)
        if (stake && stake.owner === this.wallet.publicKey.toString()) {
          stakes.push(stake)
        }
      } else {
        // Claim all rewards for user
        this.userStakes.forEach(stake => {
          if (stake.owner === this.wallet.publicKey.toString() && stake.status === 'active') {
            stakes.push(stake)
          }
        })
      }

      if (stakes.length === 0) {
        return {
          success: false,
          error: 'No active stakes found',
        }
      }

      let totalRewards = 0
      const now = Date.now()

      stakes.forEach(stake => {
        const rewards = this.calculateRewards(stake)
        totalRewards += rewards
        stake.rewards += rewards
        stake.lastRewardClaim = now
      })

      if (totalRewards === 0) {
        return {
          success: false,
          error: 'No rewards to claim',
        }
      }

      // Create claim transaction
      const tx = new Transaction()
      tx.add(
        SystemProgram.transfer({
          fromPubkey: this.wallet.publicKey,
          toPubkey: new PublicKey('11111111111111111111111111111111'), // Placeholder
          lamports: 5000, // Transaction fee
        })
      )

      const signedTx = await this.wallet.signTransaction(tx)
      const txId = await this.connection.sendRawTransaction(signedTx.serialize())
      await this.connection.confirmTransaction(txId)

      return {
        success: true,
        txId,
        message: SUCCESS.REWARDS_CLAIMED,
        details: {
          rewardsClaimed: totalRewards,
          stakesUpdated: stakes.length,
        },
      }
    } catch (error) {
      console.error('Reward claim failed:', error)
      return {
        success: false,
        error: error.message || ERRORS.TRANSACTION_FAILED,
      }
    }
  }

  /**
   * Get staking information
   */
  async getStakingInfo() {
    if (!this.wallet.publicKey) {
      return {
        success: false,
        error: ERRORS.WALLET_NOT_CONNECTED,
      }
    }

    try {
      const userAddress = this.wallet.publicKey.toString()
      const userStakes = []
      let totalStaked = 0
      let totalRewards = 0
      let totalPendingRewards = 0

      this.userStakes.forEach(stake => {
        if (stake.owner === userAddress) {
          const pendingRewards = this.calculateRewards(stake)
          totalStaked += stake.status === 'active' ? stake.amount : 0
          totalRewards += stake.rewards
          totalPendingRewards += pendingRewards

          userStakes.push({
            id: stake.id,
            amount: stake.amount,
            poolId: stake.poolId,
            apy: stake.apy,
            status: stake.status,
            stakedAt: new Date(stake.stakedAt).toISOString(),
            unlockTime: new Date(stake.unlockTime).toISOString(),
            isLocked: Date.now() < stake.unlockTime,
            rewards: stake.rewards,
            pendingRewards,
            dailyReward: this.calculateDailyReward(stake.amount, stake.apy),
          })
        }
      })

      const pools = Array.from(this.stakingPools.values()).map(pool => ({
        id: pool.id,
        name: pool.name,
        apy: pool.apy,
        lockDays: pool.lockDays,
        totalStaked: pool.totalStaked,
        participants: pool.participants,
        minStake: pool.minStake,
        active: pool.active,
      }))

      return {
        success: true,
        summary: {
          totalStaked,
          totalRewards,
          totalPendingRewards,
          activeStakes: userStakes.filter(s => s.status === 'active').length,
        },
        stakes: userStakes,
        pools,
      }
    } catch (error) {
      console.error('Failed to get staking info:', error)
      return {
        success: false,
        error: error.message || ERRORS.NETWORK_ERROR,
      }
    }
  }

  /**
   * Get available staking pools
   */
  async getStakingPools() {
    try {
      if (this.stakingPools.size === 0) {
        await this.initializePools()
      }

      const pools = Array.from(this.stakingPools.values()).map(pool => ({
        id: pool.id,
        name: pool.name,
        apy: `${pool.apy}%`,
        lockPeriod: pool.lockDays === 0 ? 'Flexible' : `${pool.lockDays} days`,
        totalStaked: pool.totalStaked,
        participants: pool.participants,
        minStake: pool.minStake,
        status: pool.active ? 'Active' : 'Inactive',
        estimatedDailyReward: (amount) => this.calculateDailyReward(amount, pool.apy),
      }))

      return {
        success: true,
        pools,
      }
    } catch (error) {
      console.error('Failed to get staking pools:', error)
      return {
        success: false,
        error: error.message || ERRORS.NETWORK_ERROR,
      }
    }
  }

  // Helper methods

  async getUserTokenBalance(tokenMint) {
    try {
      const mintPubkey = new PublicKey(tokenMint)
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        this.wallet.publicKey,
        { mint: mintPubkey }
      )

      if (tokenAccounts.value.length === 0) {
        return 0
      }

      const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount
      return balance
    } catch (error) {
      console.error('Failed to get token balance:', error)
      return 0
    }
  }

  calculateRewards(stake) {
    if (stake.status !== 'active') return 0

    const now = Date.now()
    const timeSinceLastClaim = now - stake.lastRewardClaim
    const daysStaked = timeSinceLastClaim / (24 * 60 * 60 * 1000)
    
    const dailyRate = stake.apy / 365 / 100
    const rewards = stake.amount * dailyRate * daysStaked
    
    return Math.floor(rewards * 1e9) / 1e9 // Round to 9 decimals
  }

  calculateDailyReward(amount, apy) {
    const dailyRate = apy / 365 / 100
    return Math.floor(amount * dailyRate * 1e9) / 1e9
  }

  generateStakeId() {
    return `stake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

export default StakingService