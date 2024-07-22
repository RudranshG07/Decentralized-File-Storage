# API Documentation

## Base URL
```
http://localhost:8080/api
```

## Endpoints

### Health Check
```http
GET /health
```
Returns server health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-07-15T10:30:00Z",
  "service": "decentralized-file-storage-backend",
  "version": "1.0.0"
}
```

### Files

#### Create File
```http
POST /files
```

**Request Body:**
```json
{
  "name": "document.pdf",
  "size": 1024000,
  "file_type": "application/pdf",
  "tx_id": "arweave_transaction_id",
  "owner": "wallet_address",
  "is_public": false,
  "tags": ["document", "pdf"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "document.pdf",
  "size": 1024000,
  "file_type": "application/pdf",
  "tx_id": "arweave_transaction_id",
  "uploaded_at": "2024-07-15T10:30:00Z",
  "owner": "wallet_address",
  "is_public": false,
  "tags": ["document", "pdf"]
}
```

#### Get User Files
```http
GET /files/user/{wallet_address}
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "document.pdf",
    "size": 1024000,
    "file_type": "application/pdf",
    "tx_id": "arweave_transaction_id",
    "uploaded_at": "2024-07-15T10:30:00Z",
    "owner": "wallet_address",
    "is_public": false,
    "tags": ["document", "pdf"]
  }
]
```

#### Get File by ID
```http
GET /files/{file_id}
```

#### Delete File
```http
DELETE /files/{file_id}
```

#### Share File
```http
POST /files/{file_id}/share
```

**Request Body:**
```json
{
  "recipient_address": "recipient_wallet_address",
  "access_level": "read",
  "expires_at": "2024-08-15T10:30:00Z"
}
```

#### Get Shared Files
```http
GET /files/shared/{wallet_address}
```

### Users

#### Create User
```http
POST /users
```

**Request Body:**
```json
{
  "wallet_address": "wallet_address"
}
```

#### Get User
```http
GET /users/{wallet_address}
```

#### Get User Stats
```http
GET /users/{wallet_address}/stats
```

**Response:**
```json
{
  "total_files": 10,
  "total_storage": 10240000,
  "files_uploaded_today": 2,
  "storage_used_today": 2048000,
  "most_used_file_types": [
    {
      "file_type": "image/jpeg",
      "count": 5,
      "total_size": 5120000
    }
  ]
}
```

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message"
}
```