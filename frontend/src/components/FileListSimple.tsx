'use client'

import { useState, useEffect } from 'react'
import { Download, Share2, Eye, Calendar, FileText, Image, Video, Music, Search, Filter, Trash2, Copy, Info } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { getUserFiles } from '@/utils/api'
import { format } from 'date-fns'

interface StoredFile {
  id: string
  name: string
  size: number
  type: string
  txId: string
  uploadedAt: string
  owner: string
}

export default function FileListSimple() {
  const { publicKey } = useWallet()
  const [files, setFiles] = useState<StoredFile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (publicKey) {
      loadFiles()
    }
  }, [publicKey])

  const loadFiles = async () => {
    if (!publicKey) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const userFiles = await getUserFiles(publicKey)
      setFiles(userFiles)
    } catch (error) {
      console.error('Failed to load files:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = (type: string) => {
    if (!type) return <FileText className="w-6 h-6 text-gray-400" />
    if (type.startsWith('image/')) return <Image className="w-6 h-6 text-blue-400" />
    if (type.startsWith('video/')) return <Video className="w-6 h-6 text-purple-400" />
    if (type.startsWith('audio/')) return <Music className="w-6 h-6 text-green-400" />
    return <FileText className="w-6 h-6 text-gray-400" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDownload = (file: StoredFile) => {
    window.open(`https://arweave.net/${file.txId}`, '_blank')
  }

  const handleShare = async (file: StoredFile) => {
    const shareUrl = `https://arweave.net/${file.txId}`
    try {
      await navigator.share({
        title: file.name,
        text: `Check out this file: ${file.name}`,
        url: shareUrl,
      })
    } catch (error) {
      await navigator.clipboard.writeText(shareUrl)
      alert('File URL copied to clipboard!')
    }
  }

  const handleCopyTxId = async (txId: string) => {
    try {
      await navigator.clipboard.writeText(txId)
      alert('Transaction ID copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handlePreview = (file: StoredFile) => {
    window.open(`https://arweave.net/${file.txId}`, '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        <span className="ml-3 text-gray-300">Loading your files...</span>
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No files yet</h3>
        <p className="text-gray-400">
          Upload your first file to get started with decentralized storage
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Your Files ({files.length})
        </h3>
        <button
          onClick={loadFiles}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {/* Files grid */}
      <div className="grid gap-4">
        {files.map((file) => (
          <div key={file.id} className="glass-effect bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">{file.name || 'Unknown File'}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{formatFileSize(file.size || 0)}</span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {file.uploadedAt ? format(new Date(file.uploadedAt), 'MMM dd, yyyy') : 'Unknown date'}
                    </span>
                  </div>
                  {file.type && (
                    <div className="text-xs text-gray-500">
                      {file.type}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => handlePreview(file)}
                  className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownload(file)}
                  className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare(file)}
                  className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopyTxId(file.txId)}
                  className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                  title="Copy Transaction ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-3 p-2 bg-gray-800/50 rounded text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Arweave TX:</span>
                <button
                  onClick={() => handleCopyTxId(file.txId)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  title="Click to copy"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <a
                href={`https://arweave.net/${file.txId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-mono text-xs break-all block mt-1"
              >
                {file.txId}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}