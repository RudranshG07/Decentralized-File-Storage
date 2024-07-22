'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function WalletConnect() {
  const { connected, publicKey } = useWallet()

  return (
    <div className="flex flex-col items-center space-y-4">
      <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-700 hover:!to-blue-700 !transition-all !duration-300 !rounded-lg !px-6 !py-3 !font-semibold" />
      
      {connected && publicKey && (
        <div className="glass-effect bg-white/10 rounded-lg p-4">
          <p className="text-sm text-gray-300">Connected:</p>
          <p className="text-white font-mono text-sm break-all">
            {publicKey.toString()}
          </p>
        </div>
      )}
    </div>
  )
}