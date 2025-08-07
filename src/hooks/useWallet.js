import { useAccount, useConnect, useDisconnect, useBalance, useSignMessage } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'

export function useWallet() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { openConnectModal } = useConnectModal()
  const { data: balance } = useBalance({ address })
  const { signMessage, isPending: isSigningMessage } = useSignMessage()

  return {
    // Account info
    address,
    isConnected,
    chain,
    balance,
    
    // Connection methods
    connect,
    disconnect,
    openConnectModal,
    connectors,
    
    // Signing
    signMessage,
    isSigningMessage,
  }
}