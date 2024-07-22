'use client'

import { useState, useEffect } from 'react'
import { Download, Share2, Eye, Calendar, FileText, Image, Video, Music, Search, Filter, Trash2, Copy, Info } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { getUserFiles } from '@/utils/api'
import { format } from 'date-fns'
import FileDetailsModal from './FileDetailsModal'

interface StoredFile {
  id: string
  name: string
  size: number
  type: string
  txId: string
  uploadedAt: string
  owner: string
}

export default function FileList() {
  const { publicKey } = useWallet()
  const [files, setFiles] = useState<StoredFile[]>([])
  const [filteredFiles, setFilteredFiles] = useState<StoredFile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [selectedFile, setSelectedFile] = useState<StoredFile | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
      setFilteredFiles(userFiles)
    } catch (error) {
      console.error('Failed to load files:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter and search files
  useEffect(() => {
    let filtered = [...files]

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(file => {
        if (!file.type) return false
        if (filterType === 'images') return file.type.startsWith('image/')
        if (filterType === 'videos') return file.type.startsWith('video/')
        if (filterType === 'documents') return file.type.includes('pdf') || file.type.includes('doc') || file.type.includes('text')
        if (filterType === 'audio') return file.type.startsWith('audio/')
        return true
      })
    }

    // Search by name
    if (searchTerm) {
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort files
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      }
      if (sortBy === 'size') {
        return b.size - a.size
      }
      return 0
    })

    setFilteredFiles(filtered)
  }, [files, searchTerm, filterType, sortBy])

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

  const handleDelete = async (file: StoredFile) => {
    if (!confirm(`Are you sure you want to delete "${file.name}"? This action cannot be undone.`)) {
      return
    }
    
    try {
      // In a real implementation, you would call your delete API
      // const success = await deleteFile(file.id)
      console.log('Deleting file:', file.id)
      
      // For demo, just remove from local state
      const updatedFiles = files.filter(f => f.id !== file.id)
      setFiles(updatedFiles)
      alert('File deleted successfully!')
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete file')
    }
  }

  const handlePreview = (file: StoredFile) => {
    window.open(`https://arweave.net/${file.txId}`, '_blank')
  }

  const handleShowDetails = (file: StoredFile) => {
    setSelectedFile(file)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedFile(null)
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
      {/* Header with stats and controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Your Files ({filteredFiles.length} of {files.length})
          </h3>
          <p className="text-sm text-gray-400">
            Total storage: {formatFileSize(files.reduce((acc, file) => acc + file.size, 0))}
          </p>
        </div>
        <button
          onClick={loadFiles}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {/* Search and filter controls */}
      <div className="glass-effect bg-white/5 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filter by type */}
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Files</option>
              <option value="images">Images</option>
              <option value="videos">Videos</option>
              <option value="documents">Documents</option>
              <option value="audio">Audio</option>
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
          </select>
        </div>
      </div>

      {/* Files grid */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No files match your search criteria</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredFiles.map((file) => (
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
                  onClick={() => handleShowDetails(file)}
                  className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                  title="View Details"
                >
                  <Info className="w-4 h-4" />
                </button>
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
                <button
                  onClick={() => handleDelete(file)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
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
      )}

      {/* File Details Modal */}
      <FileDetailsModal
        file={selectedFile}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDownload={handleDownload}
        onShare={handleShare}
      />
    </div>
  )
}