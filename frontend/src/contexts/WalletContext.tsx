'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WalletContextType {
  connected: boolean
  connecting: boolean
  publicKey: string | null
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)

  // Check if wallet is already connected on page load
  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).solana) {
        const solana = (window as any).solana
        if (solana.isPhantom && solana.isConnected) {
          const response = await solana.connect({ onlyIfTrusted: true })
          setPublicKey(response.publicKey.toString())
          setConnected(true)
        }
      }
    } catch (error) {
      console.log('Wallet not auto-connected:', error)
    }
  }

  const connect = async () => {
    try {
      setConnecting(true)
      
      if (typeof window !== 'undefined' && (window as any).solana) {
        const solana = (window as any).solana
        
        if (solana.isPhantom) {
          const response = await solana.connect()
          setPublicKey(response.publicKey.toString())
          setConnected(true)
          
          // Save connection state
          localStorage.setItem('walletConnected', 'true')
          localStorage.setItem('walletAddress', response.publicKey.toString())
        } else {
          throw new Error('Phantom wallet not found')
        }
      } else {
        // Redirect to Phantom website if not installed
        window.open('https://phantom.app/', '_blank')
        throw new Error('Phantom wallet not installed')
      }
    } catch (error: any) {
      console.error('Wallet connection failed:', error)
      alert(`Wallet connection failed: ${error.message}`)
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = () => {
    try {
      if (typeof window !== 'undefined' && (window as any).solana) {
        (window as any).solana.disconnect()
      }
      setConnected(false)
      setPublicKey(null)
      
      // Clear connection state
      localStorage.removeItem('walletConnected')
      localStorage.removeItem('walletAddress')
    } catch (error) {
      console.error('Disconnect failed:', error)
    }
  }

  const value: WalletContextType = {
    connected,
    connecting,
    publicKey,
    connect,
    disconnect,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}