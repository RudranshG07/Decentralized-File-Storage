use sqlx::PgPool;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use anyhow::Result;

use crate::models::{FileRecord, CreateFileRequest, ShareRecord};

pub async fn create_file(
    pool: &PgPool,
    request: CreateFileRequest,
) -> Result<FileRecord> {
    let id = Uuid::new_v4();
    let uploaded_at = Utc::now();
    let is_public = request.is_public.unwrap_or(false);
    let tags = request.tags.unwrap_or_default();

    let file = sqlx::query_as!(
        FileRecord,
        r#"
        INSERT INTO files (id, name, size, file_type, tx_id, uploaded_at, owner, is_public, encryption_key, tags)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
        "#,
        id,
        request.name,
        request.size,
        request.file_type,
        request.tx_id,
        uploaded_at,
        request.owner,
        is_public,
        request.encryption_key,
        &tags
    )
    .fetch_one(pool)
    .await?;

    // Update user stats
    sqlx::query!(
        r#"
        INSERT INTO users (wallet_address, created_at, total_files, total_storage, last_activity)
        VALUES ($1, $2, 1, $3, $2)
        ON CONFLICT (wallet_address)
        DO UPDATE SET
            total_files = users.total_files + 1,
            total_storage = users.total_storage + $3,
            last_activity = $2
        "#,
        request.owner,
        uploaded_at,
        request.size
    )
    .execute(pool)
    .await?;

    Ok(file)
}

pub async fn get_user_files(
    pool: &PgPool,
    wallet_address: &str,
) -> Result<Vec<FileRecord>> {
    let files = sqlx::query_as!(
        FileRecord,
        "SELECT * FROM files WHERE owner = $1 ORDER BY uploaded_at DESC",
        wallet_address
    )
    .fetch_all(pool)
    .await?;

    Ok(files)
}

pub async fn get_file_by_id(
    pool: &PgPool,
    file_id: Uuid,
) -> Result<Option<FileRecord>> {
    let file = sqlx::query_as!(
        FileRecord,
        "SELECT * FROM files WHERE id = $1",
        file_id
    )
    .fetch_optional(pool)
    .await?;

    Ok(file)
}

pub async fn delete_file(
    pool: &PgPool,
    file_id: Uuid,
) -> Result<bool> {
    let result = sqlx::query!(
        "DELETE FROM files WHERE id = $1",
        file_id
    )
    .execute(pool)
    .await?;

    Ok(result.rows_affected() > 0)
}

pub async fn share_file(
    pool: &PgPool,
    file_id: Uuid,
    recipient_address: &str,
    access_level: &str,
    expires_at: Option<DateTime<Utc>>,
) -> Result<ShareRecord> {
    // First, get the file to ensure it exists and get owner
    let file = sqlx::query!(
        "SELECT owner FROM files WHERE id = $1",
        file_id
    )
    .fetch_one(pool)
    .await?;

    let share_id = Uuid::new_v4();
    let shared_at = Utc::now();

    let share = sqlx::query_as!(
        ShareRecord,
        r#"
        INSERT INTO file_shares (id, file_id, owner_id, recipient_id, shared_at, access_level, expires_at, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, true)
        RETURNING *
        "#,
        share_id,
        file_id,
        file.owner,
        recipient_address,
        shared_at,
        access_level,
        expires_at
    )
    .fetch_one(pool)
    .await?;

    Ok(share)
}

pub async fn get_shared_files(
    pool: &PgPool,
    wallet_address: &str,
) -> Result<Vec<FileRecord>> {
    let files = sqlx::query_as!(
        FileRecord,
        r#"
        SELECT f.* FROM files f
        INNER JOIN file_shares fs ON f.id = fs.file_id
        WHERE fs.recipient_id = $1 AND fs.is_active = true
        AND (fs.expires_at IS NULL OR fs.expires_at > NOW())
        ORDER BY fs.shared_at DESC
        "#,
        wallet_address
    )
    .fetch_all(pool)
    .await?;

    Ok(files)
}