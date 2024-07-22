-- Create users table
CREATE TABLE users (
    wallet_address VARCHAR(44) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    total_files BIGINT NOT NULL DEFAULT 0,
    total_storage BIGINT NOT NULL DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create files table
CREATE TABLE files (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    tx_id VARCHAR(43) NOT NULL UNIQUE,
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    owner VARCHAR(44) NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
    is_public BOOLEAN NOT NULL DEFAULT false,
    encryption_key TEXT,
    tags TEXT[] DEFAULT '{}'
);

-- Create file_shares table
CREATE TABLE file_shares (
    id UUID PRIMARY KEY,
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    owner_id VARCHAR(44) NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
    recipient_id VARCHAR(44) NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
    shared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    access_level VARCHAR(20) NOT NULL DEFAULT 'read',
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(file_id, recipient_id)
);

-- Create indexes for better performance
CREATE INDEX idx_files_owner ON files(owner);
CREATE INDEX idx_files_uploaded_at ON files(uploaded_at);
CREATE INDEX idx_files_tx_id ON files(tx_id);
CREATE INDEX idx_file_shares_recipient ON file_shares(recipient_id);
CREATE INDEX idx_file_shares_file_id ON file_shares(file_id);
CREATE INDEX idx_users_last_activity ON users(last_activity);