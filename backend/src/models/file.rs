use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct FileRecord {
    pub id: Uuid,
    pub name: String,
    pub size: i64,
    pub file_type: String,
    pub tx_id: String,
    pub uploaded_at: DateTime<Utc>,
    pub owner: String,
    pub is_public: bool,
    pub encryption_key: Option<String>,
    pub tags: Vec<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateFileRequest {
    pub name: String,
    pub size: i64,
    pub file_type: String,
    pub tx_id: String,
    pub owner: String,
    pub is_public: Option<bool>,
    pub encryption_key: Option<String>,
    pub tags: Option<Vec<String>>,
}

#[derive(Debug, Serialize)]
pub struct FileResponse {
    pub id: String,
    pub name: String,
    pub size: i64,
    pub file_type: String,
    pub tx_id: String,
    pub uploaded_at: DateTime<Utc>,
    pub owner: String,
    pub is_public: bool,
    pub tags: Vec<String>,
}

impl From<FileRecord> for FileResponse {
    fn from(file: FileRecord) -> Self {
        Self {
            id: file.id.to_string(),
            name: file.name,
            size: file.size,
            file_type: file.file_type,
            tx_id: file.tx_id,
            uploaded_at: file.uploaded_at,
            owner: file.owner,
            is_public: file.is_public,
            tags: file.tags,
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct ShareFileRequest {
    pub recipient_address: String,
    pub access_level: Option<String>,
    pub expires_at: Option<DateTime<Utc>>,
}