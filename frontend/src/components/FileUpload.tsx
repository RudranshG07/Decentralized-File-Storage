'use client'

import { useState, useCallback } from 'react'
import { Upload, X, FileText, Image, Video, Music } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { uploadToArweave } from '@/utils/arweave'
import { saveFileMetadata } from '@/utils/api'

interface FileItem {
  file: File
  preview?: string
  uploading?: boolean
  uploaded?: boolean
  txId?: string
}

export default function FileUpload() {
  const { publicKey } = useWallet()
  const [files, setFiles] = useState<FileItem[]>([])
  const [dragActive, setDragActive] = useState(false)

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-6 h-6" />
    if (type.startsWith('video/')) return <Video className="w-6 h-6" />
    if (type.startsWith('audio/')) return <Music className="w-6 h-6" />
    return <FileText className="w-6 h-6" />
  }

  const handleFiles = useCallback((newFiles: FileList) => {
    const fileItems: FileItem[] = Array.from(newFiles).map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }))
    setFiles(prev => [...prev, ...fileItems])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadFile = async (index: number) => {
    if (!publicKey) {
      alert('Please connect your wallet first')
      return
    }

    const fileItem = files[index]
    setFiles(prev => prev.map((item, i) => 
      i === index ? { ...item, uploading: true } : item
    ))

    try {
      // Upload to Arweave
      const txId = await uploadToArweave(fileItem.file, publicKey)
      
      // Save metadata to backend
      await saveFileMetadata({
        name: fileItem.file.name,
        size: fileItem.file.size,
        file_type: fileItem.file.type,
        tx_id: txId,
        owner: publicKey,
        is_public: false,
        tags: [fileItem.file.type.split('/')[0]]
      })

      setFiles(prev => prev.map((item, i) => 
        i === index ? { ...item, uploading: false, uploaded: true, txId } : item
      ))

      alert('File uploaded successfully to Arweave!')
    } catch (error) {
      console.error('Upload failed:', error)
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setFiles(prev => prev.map((item, i) => 
        i === index ? { ...item, uploading: false } : item
      ))
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg text-white mb-2">
          Drag and drop files here, or click to select
        </p>
        <p className="text-sm text-gray-400 mb-4">
          Support for images, videos, documents, and more
        </p>
        <input
          type="file"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Select Files
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Files to Upload</h3>
          {files.map((fileItem, index) => (
            <div key={index} className="glass-effect bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {fileItem.preview ? (
                    <img
                      src={fileItem.preview}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-gray-400">
                      {getFileIcon(fileItem.file.type)}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium">{fileItem.file.name}</p>
                    <p className="text-sm text-gray-400">
                      {formatFileSize(fileItem.file.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {fileItem.uploaded ? (
                    <span className="text-green-400 text-sm">✓ Uploaded</span>
                  ) : fileItem.uploading ? (
                    <span className="text-blue-400 text-sm">Uploading...</span>
                  ) : (
                    <button
                      onClick={() => uploadFile(index)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      Upload
                    </button>
                  )}
                  
                  {!fileItem.uploading && (
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {fileItem.txId && (
                <div className="mt-3 p-3 bg-green-500/10 rounded border border-green-500/20">
                  <p className="text-sm text-green-400">
                    Transaction ID: 
                    <a
                      href={`https://arweave.net/${fileItem.txId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 underline hover:text-green-300"
                    >
                      {fileItem.txId}
                    </a>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}