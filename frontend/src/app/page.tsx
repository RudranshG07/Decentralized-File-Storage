'use client'

import { useState } from 'react'
import { Upload, Download, Share2, Shield, Database, Globe } from 'lucide-react'
import FileUpload from '@/components/FileUpload'
import FileList from '@/components/FileListSimple'
import PhantomWalletConnect from '@/components/PhantomWalletConnect'
import { useWallet } from '@/contexts/WalletContext'

export default function Home() {
  const { connected } = useWallet()
  const [activeTab, setActiveTab] = useState<'upload' | 'files'>('upload')
  
  console.log('Home component rendered, connected:', connected)

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      title: "Permanent Storage",
      description: "Files stored forever on Arweave blockchain"
    },
    {
      icon: <Database className="w-8 h-8 text-green-400" />,
      title: "Decentralized",
      description: "No single point of failure or censorship"
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-400" />,
      title: "Global Access",
      description: "Access your files from anywhere in the world"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #1f2937, #1e40af, #7c3aed)'}}>
      <div className="container mx-auto px-4 py-8" style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem'}}>
        <header className="text-center mb-12" style={{textAlign: 'center', marginBottom: '3rem'}}>
          <h1 className="text-5xl font-bold text-white mb-4" style={{fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem'}}>
            Decentralized File Storage
          </h1>
          <p className="text-xl text-gray-300 mb-8" style={{fontSize: '1.25rem', color: '#d1d5db', marginBottom: '2rem'}}>
            Store your files permanently on the Arweave blockchain with Web3 authentication
          </p>
          <PhantomWalletConnect />
        </header>

        {!connected ? (
          <div className="text-center">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="glass-effect bg-white/5 rounded-lg p-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-lg text-gray-300">
              Connect your wallet to start using the decentralized file storage system
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="glass-effect bg-white/5 rounded-lg p-6 mb-8">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'upload'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Files</span>
                </button>
                <button
                  onClick={() => setActiveTab('files')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'files'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>My Files</span>
                </button>
              </div>

              {activeTab === 'upload' ? (
                <FileUpload />
              ) : (
                <FileList />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}