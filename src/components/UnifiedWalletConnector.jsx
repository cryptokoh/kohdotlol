import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react'

export function UnifiedWalletConnector({ showBalance = false }) {
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum') // 'ethereum' or 'solana'
  const [showSelector, setShowSelector] = useState(false)
  
  // Solana wallet connection
  const { connected: solanaConnected, publicKey, disconnect: solanaDisconnect } = useSolanaWallet()

  const NetworkSelector = () => (
    <AnimatePresence>
      {showSelector && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute top-full left-0 mt-2 backdrop-blur-2xl rounded-2xl shadow-2xl border p-3 min-w-[200px] z-50"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(31, 41, 55, 0.5))',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="text-xs text-white/60 mb-3 font-medium tracking-wider">SELECT NETWORK</div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedNetwork('ethereum')
              setShowSelector(false)
            }}
            className={`w-full text-left p-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 ${
              selectedNetwork === 'ethereum' 
                ? 'text-white shadow-lg border' 
                : 'hover:bg-white/10 text-white/80'
            }`}
            style={selectedNetwork === 'ethereum' ? {
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.3), rgba(29, 78, 216, 0.4))',
              borderColor: 'rgba(59, 130, 246, 0.4)',
              boxShadow: '0 8px 32px rgba(37, 99, 235, 0.4)'
            } : {}}
          >
            <span className="text-lg">🟦</span>
            <span>Ethereum</span>
            {selectedNetwork === 'ethereum' && <span className="ml-auto text-blue-300">✓</span>}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedNetwork('solana')
              setShowSelector(false)
            }}
            className={`w-full text-left p-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 mt-2 ${
              selectedNetwork === 'solana' 
                ? 'text-white shadow-lg border' 
                : 'hover:bg-white/10 text-white/80'
            }`}
            style={selectedNetwork === 'solana' ? {
              background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(126, 34, 206, 0.4))',
              borderColor: 'rgba(168, 85, 247, 0.4)',
              boxShadow: '0 8px 32px rgba(147, 51, 234, 0.4)'
            } : {}}
          >
            <span className="text-lg">🟪</span>
            <span>Solana</span>
            {selectedNetwork === 'solana' && <span className="ml-auto text-purple-300">✓</span>}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const EthereumConnector = () => (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated')

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openConnectModal} 
                    type="button"
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 border shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.3), rgba(29, 78, 216, 0.4))',
                      borderColor: 'rgba(59, 130, 246, 0.4)',
                      color: 'white',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 8px 32px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <span>🟦</span>
                    Connect Ethereum
                  </motion.button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button 
                    onClick={openChainModal} 
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded text-sm font-mono hover:bg-red-400 transition-colors flex items-center gap-2"
                  >
                    <span>⚠️</span>
                    Wrong Network
                  </button>
                )
              }

              return (
                <div className="flex items-center gap-2">
                  {showBalance && (
                    <button
                      onClick={openChainModal}
                      className="bg-gray-700 text-blue-400 px-3 py-2 rounded text-sm font-mono hover:bg-gray-600 transition-colors flex items-center gap-2"
                      type="button"
                    >
                      <span>🟦</span>
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 16,
                            height: 16,
                            borderRadius: 999,
                            overflow: 'hidden',
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 16, height: 16 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button>
                  )}

                  <button 
                    onClick={openAccountModal} 
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-mono hover:bg-blue-400 transition-colors"
                  >
                    {account.displayName}
                    {showBalance && account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )

  const SolanaConnector = () => {
    if (solanaConnected && publicKey) {
      return (
        <div className="flex items-center gap-2">
          {showBalance && (
            <div className="bg-gray-700 text-purple-400 px-3 py-2 rounded text-sm font-mono flex items-center gap-2">
              <span>🟪</span>
              <span>Solana</span>
            </div>
          )}
          
          <button
            onClick={solanaDisconnect}
            className="bg-purple-500 text-white px-4 py-2 rounded text-sm font-mono hover:bg-purple-400 transition-colors flex items-center gap-2"
          >
            <span>🟪</span>
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </button>
        </div>
      )
    }

    return (
      <div className="solana-wallet-button">
        <WalletMultiButton className="!bg-purple-500 !text-white !px-4 !py-2 !rounded !text-sm !font-mono hover:!bg-purple-400 !transition-colors !flex !items-center !gap-2 !h-auto">
          <span>🟪</span>
          <span>Connect Solana</span>
        </WalletMultiButton>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Glass Network Selector Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSelector(!showSelector)}
          className="px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 border shadow-lg"
          title="Select Network"
          style={{
            background: 'linear-gradient(135deg, rgba(75, 85, 99, 0.3), rgba(55, 65, 81, 0.4))',
            borderColor: 'rgba(156, 163, 175, 0.3)',
            color: 'white',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(75, 85, 99, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <span className="drop-shadow-sm">{selectedNetwork === 'ethereum' ? '🟦' : '🟪'}</span>
          <span className="text-xs opacity-70">▼</span>
        </motion.button>

        {/* Active Wallet Connector */}
        {selectedNetwork === 'ethereum' ? <EthereumConnector /> : <SolanaConnector />}
      </div>

      <NetworkSelector />

      {/* Custom Solana Wallet Button Styles */}
      <style jsx>{`
        .solana-wallet-button .wallet-adapter-button {
          background-color: #8b5cf6 !important;
          color: white !important;
          font-family: 'Courier New', monospace !important;
          font-size: 14px !important;
          padding: 8px 16px !important;
          border-radius: 6px !important;
          border: none !important;
          transition: all 0.2s !important;
          height: auto !important;
          min-height: auto !important;
        }
        
        .solana-wallet-button .wallet-adapter-button:hover {
          background-color: #7c3aed !important;
        }

        .solana-wallet-button .wallet-adapter-button:not([disabled]):hover {
          background-color: #7c3aed !important;
        }
        
        .solana-wallet-button .wallet-adapter-button-trigger {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
      `}</style>
    </div>
  )
}