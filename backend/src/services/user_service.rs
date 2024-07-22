use sqlx::PgPool;
use chrono::Utc;
use anyhow::Result;

use crate::models::{User, UserStats, FileTypeUsage};

pub async fn create_user(
    pool: &PgPool,
    wallet_address: &str,
) -> Result<User> {
    let created_at = Utc::now();

    let user = sqlx::query_as!(
        User,
        r#"
        INSERT INTO users (wallet_address, created_at, total_files, total_storage, last_activity)
        VALUES ($1, $2, 0, 0, $2)
        ON CONFLICT (wallet_address) DO NOTHING
        RETURNING *
        "#,
        wallet_address,
        created_at
    )
    .fetch_one(pool)
    .await?;

    Ok(user)
}

pub async fn get_user(
    pool: &PgPool,
    wallet_address: &str,
) -> Result<Option<User>> {
    let user = sqlx::query_as!(
        User,
        "SELECT * FROM users WHERE wallet_address = $1",
        wallet_address
    )
    .fetch_optional(pool)
    .await?;

    Ok(user)
}

pub async fn get_user_stats(
    pool: &PgPool,
    wallet_address: &str,
) -> Result<UserStats> {
    // Get basic user stats
    let user = sqlx::query!(
        "SELECT total_files, total_storage FROM users WHERE wallet_address = $1",
        wallet_address
    )
    .fetch_one(pool)
    .await?;

    // Get files uploaded today
    let today_stats = sqlx::query!(
        r#"
        SELECT COUNT(*) as files_today, COALESCE(SUM(size), 0) as storage_today
        FROM files 
        WHERE owner = $1 AND uploaded_at >= CURRENT_DATE
        "#,
        wallet_address
    )
    .fetch_one(pool)
    .await?;

    // Get file type usage
    let file_types = sqlx::query!(
        r#"
        SELECT file_type, COUNT(*) as count, SUM(size) as total_size
        FROM files 
        WHERE owner = $1
        GROUP BY file_type
        ORDER BY count DESC
        LIMIT 10
        "#,
        wallet_address
    )
    .fetch_all(pool)
    .await?;

    let most_used_file_types = file_types
        .into_iter()
        .map(|row| FileTypeUsage {
            file_type: row.file_type,
            count: row.count.unwrap_or(0),
            total_size: row.total_size.unwrap_or(0),
        })
        .collect();

    Ok(UserStats {
        total_files: user.total_files,
        total_storage: user.total_storage,
        files_uploaded_today: today_stats.files_today.unwrap_or(0),
        storage_used_today: today_stats.storage_today.unwrap_or(0),
        most_used_file_types,
    })
}