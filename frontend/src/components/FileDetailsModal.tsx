'use client'

import { useState } from 'react'
import { X, Download, Share2, Copy, Eye, Calendar, HardDrive, FileText, Image, Video, Music } from 'lucide-react'
import { format } from 'date-fns'

interface FileDetailsModalProps {
  file: {
    id: string
    name: string
    size: number
    type: string
    txId: string
    uploadedAt: string
    owner: string
  } | null
  isOpen: boolean
  onClose: () => void
  onDownload: (file: any) => void
  onShare: (file: any) => void
}

export default function FileDetailsModal({ 
  file, 
  isOpen, 
  onClose, 
  onDownload, 
  onShare 
}: FileDetailsModalProps) {
  if (!isOpen || !file) return null

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-8 h-8 text-blue-400" />
    if (type.startsWith('video/')) return <Video className="w-8 h-8 text-purple-400" />
    if (type.startsWith('audio/')) return <Music className="w-8 h-8 text-green-400" />
    return <FileText className="w-8 h-8 text-gray-400" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleCopyTxId = async () => {
    try {
      await navigator.clipboard.writeText(file.txId)
      alert('Transaction ID copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleCopyArweaveUrl = async () => {
    const url = `https://arweave.net/${file.txId}`
    try {
      await navigator.clipboard.writeText(url)
      alert('Arweave URL copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-effect bg-gray-900/95 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            {getFileIcon(file.type)}
            <div>
              <h2 className="text-xl font-semibold text-white">{file.name}</h2>
              <p className="text-sm text-gray-400">{file.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <HardDrive className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Size:</span>
                <span className="text-white">{formatFileSize(file.size)}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Uploaded:</span>
                <span className="text-white">{format(new Date(file.uploadedAt), 'MMM dd, yyyy HH:mm')}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="text-gray-400">File ID:</span>
                <p className="text-white font-mono text-xs break-all">{file.id}</p>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Owner:</span>
                <p className="text-white font-mono text-xs break-all">{file.owner}</p>
              </div>
            </div>
          </div>

          {/* Arweave Transaction */}
          <div className="glass-effect bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-medium mb-3">Arweave Transaction</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">Transaction ID:</span>
                  <button
                    onClick={handleCopyTxId}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    title="Copy Transaction ID"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-white font-mono text-xs break-all bg-gray-800 p-2 rounded">
                  {file.txId}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">Arweave URL:</span>
                  <button
                    onClick={handleCopyArweaveUrl}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    title="Copy Arweave URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <a
                  href={`https://arweave.net/${file.txId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-mono text-xs break-all bg-gray-800 p-2 rounded block"
                >
                  https://arweave.net/{file.txId}
                </a>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => window.open(`https://arweave.net/${file.txId}`, '_blank')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => onDownload(file)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              onClick={() => onShare(file)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}