# Architecture Overview

## System Design

The Decentralized File Storage system is built with a modern, scalable architecture that leverages Web3 technologies for true decentralization.

### Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Arweave       │
│   (Next.js)     │◄──►│   (Rust)        │◄──►│   Network       │
│                 │    │                 │    │                 │
│ - React UI      │    │ - REST API      │    │ - File Storage  │
│ - Web3 Auth     │    │ - File Metadata │    │ - Permanent     │
│ - Arweave SDK   │    │ - User Management│    │ - Decentralized │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │   Database      │
                       │                 │
                       │ - Metadata      │
                       │ - User Data     │
                       │ - Sharing Info  │
                       └─────────────────┘
```

### Tech Stack

#### Frontend
- **Framework**: Next.js 14 with TypeScript
- **UI**: Tailwind CSS for styling
- **Web3**: Solana wallet integration
- **Storage**: Arweave SDK for file uploads
- **State**: Zustand for client state management

#### Backend
- **Language**: Rust
- **Framework**: Actix-web
- **Database**: PostgreSQL with SQLx
- **Authentication**: Web3 wallet signatures

#### Storage & Blockchain
- **File Storage**: Arweave permanent storage
- **Metadata**: PostgreSQL database
- **Authentication**: Solana wallets
- **Smart Contracts**: Solana programs (optional)

### Data Flow

1. **User Authentication**
   - User connects Solana wallet
   - Frontend verifies wallet connection
   - Backend creates/retrieves user profile

2. **File Upload**
   - User selects files in frontend
   - Files uploaded directly to Arweave
   - Metadata saved to PostgreSQL via backend API
   - Transaction ID stored for future retrieval

3. **File Retrieval**
   - Backend queries metadata from PostgreSQL
   - Frontend fetches files from Arweave using transaction IDs
   - Files displayed in user interface

4. **File Sharing**
   - Owner creates share record in database
   - Recipient can access file via shared link
   - Access control managed by backend

### Security Considerations

- Files stored immutably on Arweave
- Metadata encrypted in database
- Web3 authentication prevents unauthorized access
- CORS configured for secure cross-origin requests
- Input validation on all API endpoints

### Performance Optimizations

- Frontend caching of file metadata
- Lazy loading of file lists
- Optimized database queries with indexes
- CDN-like access through Arweave gateways