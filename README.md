# 🚀 Decentralized File Storage System

A cutting-edge decentralized file storage solution that leverages blockchain technology for permanent, secure file storage. Built with modern web technologies and Arweave's permaweb.

![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![Build Status](https://img.shields.io/badge/Build-Passing-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### 🔐 **Web3 Integration**
- **Phantom Wallet Authentication** - Secure Solana wallet connection
- **Real-time Wallet State** - Persistent connection management
- **Transaction Tracking** - Full Arweave transaction history

### 📁 **Advanced File Management**
- **Drag & Drop Upload** - Intuitive file upload interface
- **Real-time Progress** - Live upload progress tracking
- **Smart Search & Filter** - Find files by name, type, date
- **File Preview** - Direct Arweave file access
- **Instant Download** - One-click file retrieval
- **Secure Sharing** - Generate shareable Arweave links

### 🎨 **Modern UI/UX**
- **Glass Morphism Design** - Beautiful translucent interfaces
- **Responsive Layout** - Works on desktop and mobile
- **Dark Theme** - Eye-friendly gradient backgrounds
- **Smooth Animations** - Polished user interactions

### ⚡ **Performance & Reliability**
- **Permanent Storage** - Files stored forever on Arweave
- **Decentralized Architecture** - No single point of failure
- **Fast Loading** - Optimized for speed and efficiency
- **Error Handling** - Graceful error recovery

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Glass Effects
- **Icons**: Lucide React
- **State**: React Hooks + Custom Context

### Backend
- **Runtime**: Node.js (Development) / Rust (Production)
- **API**: RESTful endpoints with CORS support
- **Database**: PostgreSQL with SQLx migrations
- **Authentication**: Web3 wallet verification

### Blockchain & Storage
- **Storage**: Arweave permanent blockchain storage
- **Wallet**: Solana Phantom wallet integration
- **Network**: Devnet for development, Mainnet ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Phantom Wallet browser extension
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/RudranshG07/Decentralized-File-Storage.git
cd Decentralized-File-Storage
```

2. **Install dependencies**
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. **Start the development servers**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

4. **Open your browser**
```
http://localhost:3000
```

## 📱 How to Use

### 1. **Connect Your Wallet**
- Click "Connect Phantom Wallet"
- Approve the connection in your Phantom wallet
- Your wallet address will be displayed

### 2. **Upload Files**
- Switch to "Upload Files" tab
- Drag & drop files or click to select
- Click "Upload" to store on Arweave permanently
- Monitor progress and get transaction confirmation

### 3. **Manage Your Files**
- Switch to "My Files" tab
- Search files by name
- Filter by type (Images, Videos, Documents, Audio)
- Sort by date, name, or size

### 4. **File Actions**
- **Preview**: View files directly on Arweave
- **Download**: Download files to your device
- **Share**: Copy shareable Arweave URLs
- **Copy TX ID**: Get transaction IDs for verification

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Arweave       │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   Network       │
│                 │    │                 │    │                 │
│ • React UI      │    │ • REST API      │    │ • File Storage  │
│ • Wallet Auth   │    │ • File Metadata │    │ • Permanent     │
│ • File Upload   │    │ • User Mgmt     │    │ • Immutable     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │   Database      │
                       │ • File Metadata │
                       │ • User Data     │
                       └─────────────────┘
```

## 🌐 Production Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
```

### Backend (Railway/Render)
```bash
# Setup PostgreSQL database
# Deploy Rust backend
cargo build --release
```

## 📄 API Documentation

### Endpoints
- `GET /api/health` - Health check
- `POST /api/files` - Upload file metadata
- `GET /api/files/user/:address` - Get user files
- `GET /api/files/:id` - Get file by ID
- `DELETE /api/files/:id` - Delete file
- `POST /api/files/:id/share` - Share file

See [API.md](docs/API.md) for detailed documentation.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Arweave** for permanent storage infrastructure
- **Solana** for blockchain wallet integration
- **Next.js** for the amazing React framework
- **Tailwind CSS** for beautiful styling utilities

---

**Made with ❤️ by [Rudransh Garewal](https://github.com/RudranshG07)**

⭐ **Star this repo if you found it helpful!**