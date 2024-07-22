const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
let files = [];
let users = {};

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'decentralized-file-storage-mock-backend',
    version: '1.0.0'
  });
});

// Create user
app.post('/api/users', (req, res) => {
  const { wallet_address } = req.body;
  
  if (!users[wallet_address]) {
    users[wallet_address] = {
      wallet_address,
      created_at: new Date().toISOString(),
      total_files: 0,
      total_storage: 0,
      last_activity: new Date().toISOString()
    };
  }
  
  res.status(201).json(users[wallet_address]);
});

// Get user
app.get('/api/users/:wallet_address', (req, res) => {
  const user = users[req.params.wallet_address];
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Create file
app.post('/api/files', (req, res) => {
  const { name, size, file_type, tx_id, owner, is_public, tags } = req.body;
  
  const file = {
    id: Date.now().toString(),
    name,
    size,
    file_type,
    tx_id,
    uploaded_at: new Date().toISOString(),
    owner,
    is_public: is_public || false,
    tags: tags || []
  };
  
  files.push(file);
  
  // Update user stats
  if (users[owner]) {
    users[owner].total_files += 1;
    users[owner].total_storage += size;
    users[owner].last_activity = new Date().toISOString();
  }
  
  // Transform response to match frontend interface
  const responseFile = {
    id: file.id,
    name: file.name,
    size: file.size,
    type: file.file_type,
    txId: file.tx_id,
    uploadedAt: file.uploaded_at,
    owner: file.owner
  };
  
  res.status(201).json(responseFile);
});

// Get user files
app.get('/api/files/user/:wallet_address', (req, res) => {
  const userFiles = files.filter(file => file.owner === req.params.wallet_address);
  
  // Transform data to match frontend interface
  const transformedFiles = userFiles.map(file => ({
    id: file.id,
    name: file.name,
    size: file.size,
    type: file.file_type, // Map file_type to type
    txId: file.tx_id, // Map tx_id to txId
    uploadedAt: file.uploaded_at, // Map uploaded_at to uploadedAt
    owner: file.owner
  }));
  
  res.json(transformedFiles);
});

// Get file by ID
app.get('/api/files/:file_id', (req, res) => {
  const file = files.find(f => f.id === req.params.file_id);
  if (file) {
    // Transform data to match frontend interface
    const transformedFile = {
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.file_type,
      txId: file.tx_id,
      uploadedAt: file.uploaded_at,
      owner: file.owner
    };
    res.json(transformedFile);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Delete file
app.delete('/api/files/:file_id', (req, res) => {
  const index = files.findIndex(f => f.id === req.params.file_id);
  if (index !== -1) {
    files.splice(index, 1);
    res.json({ message: 'File deleted successfully' });
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Share file
app.post('/api/files/:file_id/share', (req, res) => {
  const { recipient_address } = req.body;
  res.status(201).json({
    id: Date.now().toString(),
    file_id: req.params.file_id,
    recipient_address,
    shared_at: new Date().toISOString()
  });
});

// Get shared files
app.get('/api/files/shared/:wallet_address', (req, res) => {
  // For demo purposes, return empty array
  res.json([]);
});

// Get user stats
app.get('/api/users/:wallet_address/stats', (req, res) => {
  const user = users[req.params.wallet_address];
  if (user) {
    const userFiles = files.filter(f => f.owner === req.params.wallet_address);
    const fileTypes = {};
    
    userFiles.forEach(file => {
      if (!fileTypes[file.file_type]) {
        fileTypes[file.file_type] = { count: 0, total_size: 0 };
      }
      fileTypes[file.file_type].count += 1;
      fileTypes[file.file_type].total_size += file.size;
    });
    
    const most_used_file_types = Object.entries(fileTypes).map(([type, data]) => ({
      file_type: type,
      count: data.count,
      total_size: data.total_size
    }));
    
    res.json({
      total_files: user.total_files,
      total_storage: user.total_storage,
      files_uploaded_today: 0,
      storage_used_today: 0,
      most_used_file_types
    });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Mock backend server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;