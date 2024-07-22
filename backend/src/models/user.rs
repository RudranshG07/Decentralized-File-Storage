use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct User {
    pub wallet_address: String,
    pub created_at: DateTime<Utc>,
    pub total_files: i64,
    pub total_storage: i64,
    pub last_activity: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateUserRequest {
    pub wallet_address: String,
}

#[derive(Debug, Serialize)]
pub struct UserResponse {
    pub wallet_address: String,
    pub created_at: DateTime<Utc>,
    pub total_files: i64,
    pub total_storage: i64,
    pub last_activity: DateTime<Utc>,
}

impl From<User> for UserResponse {
    fn from(user: User) -> Self {
        Self {
            wallet_address: user.wallet_address,
            created_at: user.created_at,
            total_files: user.total_files,
            total_storage: user.total_storage,
            last_activity: user.last_activity,
        }
    }
}

#[derive(Debug, Serialize)]
pub struct UserStats {
    pub total_files: i64,
    pub total_storage: i64,
    pub files_uploaded_today: i64,
    pub storage_used_today: i64,
    pub most_used_file_types: Vec<FileTypeUsage>,
}

#[derive(Debug, Serialize)]
pub struct FileTypeUsage {
    pub file_type: String,
    pub count: i64,
    pub total_size: i64,
}