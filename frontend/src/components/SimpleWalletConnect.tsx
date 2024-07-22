'use client'

import { useState } from 'react'
import { Wallet } from 'lucide-react'

export default function SimpleWalletConnect() {
  const [connected, setConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>('')

  const connectWallet = async () => {
    try {
      // Check if Phantom wallet is available
      if (typeof window !== 'undefined' && (window as any).solana) {
        const response = await (window as any).solana.connect()
        setWalletAddress(response.publicKey.toString())
        setConnected(true)
      } else {
        // Demo mode - simulate connection
        const demoAddress = 'Demo' + Math.random().toString(36).substring(2, 15)
        setWalletAddress(demoAddress)
        setConnected(true)
        alert('Demo mode: Phantom wallet not detected. Using demo wallet for testing.')
      }
    } catch (error) {
      console.error('Wallet connection failed:', error)
      alert('Failed to connect wallet')
    }
  }

  const disconnectWallet = () => {
    setConnected(false)
    setWalletAddress('')
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {!connected ? (
        <button
          onClick={connectWallet}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 font-semibold"
        >
          <Wallet className="w-5 h-5" />
          <span>Connect Wallet</span>
        </button>
      ) : (
        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={disconnectWallet}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 font-semibold"
          >
            <Wallet className="w-5 h-5" />
            <span>Disconnect</span>
          </button>
          
          <div className="glass-effect bg-white/10 rounded-lg p-4">
            <p className="text-sm text-gray-300">Connected:</p>
            <p className="text-white font-mono text-sm break-all">
              {walletAddress}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}