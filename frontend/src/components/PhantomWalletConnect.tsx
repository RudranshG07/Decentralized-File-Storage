'use client'

import { Wallet, ExternalLink } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'

export default function PhantomWalletConnect() {
  const { connected, connecting, publicKey, connect, disconnect } = useWallet()

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const openPhantomApp = () => {
    window.open('https://phantom.app/', '_blank')
  }

  if (connected && publicKey) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="glass-effect bg-green-500/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm text-green-400 font-medium">Wallet Connected</p>
              <p className="text-white font-mono text-sm">
                {truncateAddress(publicKey)}
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={connect}
        disabled={connecting}
        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 font-semibold"
      >
        <Wallet className="w-5 h-5" />
        <span>{connecting ? 'Connecting...' : 'Connect Phantom Wallet'}</span>
      </button>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-400">
          Don't have Phantom wallet?
        </p>
        <button
          onClick={openPhantomApp}
          className="inline-flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors text-sm"
        >
          <span>Download Phantom</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="glass-effect bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-md">
        <h4 className="text-white font-medium mb-2">Why Connect Your Wallet?</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Authenticate file ownership</li>
          <li>• Store files on Arweave permanently</li>
          <li>• Manage file access controls</li>
          <li>• Track your storage usage</li>
        </ul>
      </div>
    </div>
  )
}