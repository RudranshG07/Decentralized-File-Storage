use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct ShareRecord {
    pub id: Uuid,
    pub file_id: Uuid,
    pub owner_id: String,
    pub recipient_id: String,
    pub shared_at: DateTime<Utc>,
    pub access_level: String,
    pub expires_at: Option<DateTime<Utc>>,
    pub is_active: bool,
}

#[derive(Debug, Serialize)]
pub struct ShareResponse {
    pub id: String,
    pub file_id: String,
    pub owner_id: String,
    pub recipient_id: String,
    pub shared_at: DateTime<Utc>,
    pub access_level: String,
    pub expires_at: Option<DateTime<Utc>>,
    pub is_active: bool,
}

impl From<ShareRecord> for ShareResponse {
    fn from(share: ShareRecord) -> Self {
        Self {
            id: share.id.to_string(),
            file_id: share.file_id.to_string(),
            owner_id: share.owner_id,
            recipient_id: share.recipient_id,
            shared_at: share.shared_at,
            access_level: share.access_level,
            expires_at: share.expires_at,
            is_active: share.is_active,
        }
    }
}