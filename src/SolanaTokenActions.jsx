import { useState, useEffect } from 'react'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { motion, AnimatePresence } from 'framer-motion'
import { getMint, getAccount } from '@solana/spl-token'

// Ultra Extreme Token Stats Display
function TokenStat({ label, value, unit = '', color, delay = 0 }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 blur-xl group-hover:blur-2xl transition-all duration-300" />
      <div className="relative bg-black/80 border border-white/20 rounded-xl p-3 sm:p-4 backdrop-blur-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-shimmer bg-[length:200%_200%]" />
        <h3 className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</h3>
        <div className={`text-lg sm:text-2xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
          {value}
          <span className="text-xs sm:text-sm ml-1">{unit}</span>
        </div>
      </div>
    </motion.div>
  )
}

// Particle Explosion on Success
function SuccessExplosion({ trigger }) {
  if (!trigger) return null
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4"
          style={{
            left: '50%',
            top: '50%',
            background: `radial-gradient(circle, ${['#ff006e', '#00f5ff', '#ffb700', '#ff00ff', '#00ff00'][i % 5]} 0%, transparent 70%)`
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: (Math.random() - 0.5) * window.innerWidth,
            y: (Math.random() - 0.5) * window.innerHeight,
            scale: [1, 2, 0],
            opacity: [1, 1, 0],
            rotate: Math.random() * 720 - 360
          }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      ))}
    </div>
  )
}

// Loading Animation
function LoadingRings() {
  return (
    <div className="relative w-32 h-32">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 border-4 rounded-full"
          style={{
            borderColor: ['#ff006e', '#00f5ff', '#ffb700'][i],
            borderTopColor: 'transparent',
            transform: `scale(${1 + i * 0.3})`
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1 + i * 0.5, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  )
}

export function SolanaTokenActions({ tokenAddress }) {
  const [connection, setConnection] = useState(null)
  const [tokenInfo, setTokenInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successTrigger, setSuccessTrigger] = useState(false)
  const [randomAction, setRandomAction] = useState(null)
  const [priceData, setPriceData] = useState(null)
  
  // Initialize connection
  useEffect(() => {
    // Using your custom RPC endpoint
    try {
      const rpcUrl = 'https://lb.drpc.org/solana/Aqfm2hO8SEtdr3WkOHEz8w32Snnab04R8LTeEklbR4ac'
      
      const conn = new Connection(rpcUrl, {
        commitment: 'confirmed',
        httpHeaders: {
          'Content-Type': 'application/json',
        }
      })
      setConnection(conn)
    } catch (err) {
      console.error('Failed to connect to Solana:', err)
      setError('Failed to connect to Solana network')
    }
  }, [])
  
  // Fetch token information
  const fetchTokenInfo = async () => {
    if (!connection || !tokenAddress) return
    
    setLoading(true)
    setError(null)
    
    try {
      const mintPubkey = new PublicKey(tokenAddress)
      const mintInfo = await getMint(connection, mintPubkey)
      
      setTokenInfo({
        address: tokenAddress,
        decimals: mintInfo.decimals,
        supply: mintInfo.supply.toString(),
        freezeAuthority: mintInfo.freezeAuthority?.toBase58() || 'None',
        mintAuthority: mintInfo.mintAuthority?.toBase58() || 'None (Renounced)',
      })
      
      // Simulate price data (in real app, fetch from API)
      setPriceData({
        price: (Math.random() * 0.01).toFixed(6),
        change24h: (Math.random() * 40 - 20).toFixed(2),
        volume24h: Math.floor(Math.random() * 10000000),
        marketCap: Math.floor(Math.random() * 50000000)
      })
      
      setSuccessTrigger(true)
      setTimeout(() => setSuccessTrigger(false), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  // Fun random actions
  const crazyActions = [
    { 
      name: "🚀 MOON SIMULATOR", 
      action: () => {
        setRandomAction("INITIATING MOON SEQUENCE... 🌙")
        setTimeout(() => setRandomAction("ROCKET FUEL LOADED! 🚀🚀🚀"), 1000)
        setTimeout(() => setRandomAction("WE'RE GOING TO MARS! 🔴"), 2000)
        setTimeout(() => setRandomAction(null), 3000)
      }
    },
    {
      name: "💎 DIAMOND HANDS TEST",
      action: () => {
        setRandomAction("TESTING YOUR HANDS... 🤲")
        setTimeout(() => setRandomAction("PRESSURE APPLIED! 💪"), 1000)
        setTimeout(() => setRandomAction("CONGRATULATIONS! YOU HAVE DIAMOND HANDS! 💎🙌"), 2000)
        setTimeout(() => setRandomAction(null), 3000)
      }
    },
    {
      name: "🎰 PRICE PREDICTION",
      action: () => {
        const prediction = (Math.random() * 100).toFixed(2)
        setRandomAction("CONSULTING THE BLOCKCHAIN ORACLE... 🔮")
        setTimeout(() => setRandomAction(`PREDICTION: $${prediction} BY EOY! 📈`), 1500)
        setTimeout(() => setRandomAction(null), 3000)
      }
    },
    {
      name: "⚡ VIBE CHECK",
      action: () => {
        const vibes = ["IMMACULATE ✨", "BULLISH AF 🐂", "COSMIC 🌌", "LEGENDARY 👑", "TRANSCENDENT 🌈"]
        setRandomAction("ANALYZING VIBES... 📊")
        setTimeout(() => setRandomAction(`YOUR VIBES ARE: ${vibes[Math.floor(Math.random() * vibes.length)]}`), 1500)
        setTimeout(() => setRandomAction(null), 3000)
      }
    },
    {
      name: "🎲 LUCKY NUMBER",
      action: () => {
        const lucky = Math.floor(Math.random() * 1000000)
        setRandomAction("GENERATING LUCKY NUMBER... 🎲")
        setTimeout(() => setRandomAction(`YOUR LUCKY NUMBER: ${lucky} 🍀`), 1000)
        setTimeout(() => setRandomAction(`BUY ${lucky} TOKENS FOR MAXIMUM LUCK! 🌟`), 2000)
        setTimeout(() => setRandomAction(null), 3500)
      }
    }
  ]
  
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <SuccessExplosion trigger={successTrigger} />
      
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-black mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-gradient bg-300%">
            SOLANA TOKEN COMMAND CENTER
          </span>
        </h2>
        <p className="text-gray-400">Real-time blockchain data with maximum chaos</p>
      </motion.div>
      
      {/* Fetch Button */}
      <motion.div className="flex justify-center mb-8">
        <motion.button
          onClick={fetchTokenInfo}
          disabled={loading}
          className="relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg group overflow-hidden disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">
            {loading ? 'LOADING...' : 'FETCH TOKEN DATA'}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </motion.button>
      </motion.div>
      
      {/* Loading State */}
      {loading && (
        <motion.div 
          className="flex justify-center items-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <LoadingRings />
        </motion.div>
      )}
      
      {/* Error State */}
      {error && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-6"
        >
          <p className="text-red-400 font-bold mb-2">ERROR: {error}</p>
          <motion.button
            onClick={() => {
              setError(null)
              fetchTokenInfo()
            }}
            className="px-4 py-2 bg-red-500/30 hover:bg-red-500/50 border border-red-500 rounded-lg text-sm font-bold transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            RETRY
          </motion.button>
        </motion.div>
      )}
      
      {/* Token Info Display */}
      {tokenInfo && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Basic Info */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <TokenStat 
              label="Token Address" 
              value={`${tokenInfo.address.slice(0, 4)}...${tokenInfo.address.slice(-4)}`}
              color="from-purple-400 to-pink-400"
              delay={0.1}
            />
            <TokenStat 
              label="Decimals" 
              value={tokenInfo.decimals}
              color="from-cyan-400 to-blue-400"
              delay={0.2}
            />
            <TokenStat 
              label="Total Supply" 
              value={(parseInt(tokenInfo.supply) / Math.pow(10, tokenInfo.decimals)).toLocaleString()}
              color="from-green-400 to-emerald-400"
              delay={0.3}
            />
            <TokenStat 
              label="Mint Authority" 
              value={tokenInfo.mintAuthority === 'None (Renounced)' ? 'RENOUNCED 🔥' : 'Active'}
              color="from-orange-400 to-red-400"
              delay={0.4}
            />
          </div>
          
          {/* Price Data */}
          {priceData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <TokenStat 
                label="Price" 
                value={priceData.price}
                unit="$"
                color="from-yellow-400 to-orange-400"
                delay={0.5}
              />
              <TokenStat 
                label="24h Change" 
                value={priceData.change24h}
                unit="%"
                color={parseFloat(priceData.change24h) > 0 ? "from-green-400 to-emerald-400" : "from-red-400 to-pink-400"}
                delay={0.6}
              />
              <TokenStat 
                label="24h Volume" 
                value={priceData.volume24h.toLocaleString()}
                unit="$"
                color="from-blue-400 to-indigo-400"
                delay={0.7}
              />
              <TokenStat 
                label="Market Cap" 
                value={priceData.marketCap.toLocaleString()}
                unit="$"
                color="from-purple-400 to-violet-400"
                delay={0.8}
              />
            </div>
          )}
          
          {/* Fun Actions */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="bg-black/60 border border-white/20 rounded-2xl p-6 backdrop-blur-xl"
          >
            <h3 className="text-2xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500">
              CRAZY TOKEN ACTIONS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {crazyActions.map((action, i) => (
                <motion.button
                  key={action.name}
                  onClick={action.action}
                  className="relative px-4 py-3 bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-lg font-bold text-sm hover:from-purple-600 hover:to-pink-600 transition-all duration-300 group overflow-hidden"
                  whileHover={{ scale: 1.05, rotate: Math.random() * 4 - 2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                >
                  <span className="relative z-10">{action.name}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-green-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                </motion.button>
              ))}
            </div>
          </motion.div>
          
          {/* Random Action Display */}
          <AnimatePresence>
            {randomAction && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-black/90 border-2 border-white/50 rounded-2xl p-8 backdrop-blur-xl"
              >
                <div className="text-3xl font-black text-center">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 animate-gradient bg-300%">
                    {randomAction}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}