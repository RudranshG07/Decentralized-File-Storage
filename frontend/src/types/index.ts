export interface User {
  walletAddress: string
  createdAt: string
  totalFiles: number
  totalStorage: number
}

export interface FileRecord {
  id: string
  name: string
  size: number
  type: string
  txId: string
  uploadedAt: string
  owner: string
  isPublic: boolean
  encryptionKey?: string
  tags: string[]
}

export interface ShareRecord {
  id: string
  fileId: string
  ownerId: string
  recipientId: string
  sharedAt: string
  accessLevel: 'read' | 'write'
  expiresAt?: string
}

export interface UploadProgress {
  fileId: string
  fileName: string
  progress: number
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed'
  txId?: string
  error?: string
}

export interface ArweaveTransaction {
  id: string
  data: any
  tags: Array<{
    name: string
    value: string
  }>
  fee: string
  quantity: string
  reward: string
  last_tx: string
  owner: string
  target: string
}

export interface WalletContextType {
  connected: boolean
  connecting: boolean
  publicKey: string | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}