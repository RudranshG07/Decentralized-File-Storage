import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface FileMetadata {
  id: string
  name: string
  size: number
  type: string
  txId: string
  uploadedAt: string
  owner: string
}

export const saveFileMetadata = async (metadata: Omit<FileMetadata, 'id' | 'uploadedAt'>): Promise<FileMetadata> => {
  try {
    const response = await api.post('/api/files', metadata)
    return response.data
  } catch (error) {
    console.error('Save metadata error:', error)
    throw new Error('Failed to save file metadata')
  }
}

export const getUserFiles = async (walletAddress: string): Promise<FileMetadata[]> => {
  try {
    const response = await api.get(`/api/files/user/${walletAddress}`)
    return response.data
  } catch (error) {
    console.error('Get user files error:', error)
    return [] // Return empty array on error for graceful degradation
  }
}

export const getFileById = async (fileId: string): Promise<FileMetadata | null> => {
  try {
    const response = await api.get(`/api/files/${fileId}`)
    return response.data
  } catch (error) {
    console.error('Get file by ID error:', error)
    return null
  }
}

export const deleteFile = async (fileId: string): Promise<boolean> => {
  try {
    await api.delete(`/api/files/${fileId}`)
    return true
  } catch (error) {
    console.error('Delete file error:', error)
    return false
  }
}

export const shareFile = async (fileId: string, recipientAddress: string): Promise<boolean> => {
  try {
    await api.post(`/api/files/${fileId}/share`, { recipientAddress })
    return true
  } catch (error) {
    console.error('Share file error:', error)
    return false
  }
}

export const getSharedFiles = async (walletAddress: string): Promise<FileMetadata[]> => {
  try {
    const response = await api.get(`/api/files/shared/${walletAddress}`)
    return response.data
  } catch (error) {
    console.error('Get shared files error:', error)
    return []
  }
}