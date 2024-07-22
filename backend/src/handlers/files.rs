use actix_web::{web, HttpResponse, Result};
use sqlx::PgPool;
use uuid::Uuid;
use chrono::Utc;

use crate::models::{CreateFileRequest, FileResponse, ShareFileRequest};
use crate::services::file_service;

pub async fn create_file(
    pool: web::Data<PgPool>,
    request: web::Json<CreateFileRequest>,
) -> Result<HttpResponse> {
    match file_service::create_file(pool.get_ref(), request.into_inner()).await {
        Ok(file) => Ok(HttpResponse::Created().json(FileResponse::from(file))),
        Err(e) => {
            log::error!("Failed to create file: {}", e);
            Ok(HttpResponse::InternalServerError().json("Failed to create file"))
        }
    }
}

pub async fn get_user_files(
    pool: web::Data<PgPool>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let wallet_address = path.into_inner();
    
    match file_service::get_user_files(pool.get_ref(), &wallet_address).await {
        Ok(files) => {
            let response: Vec<FileResponse> = files.into_iter().map(FileResponse::from).collect();
            Ok(HttpResponse::Ok().json(response))
        }
        Err(e) => {
            log::error!("Failed to get user files: {}", e);
            Ok(HttpResponse::InternalServerError().json("Failed to get user files"))
        }
    }
}

pub async fn get_file_by_id(
    pool: web::Data<PgPool>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let file_id = match Uuid::parse_str(&path.into_inner()) {
        Ok(id) => id,
        Err(_) => return Ok(HttpResponse::BadRequest().json("Invalid file ID")),
    };

    match file_service::get_file_by_id(pool.get_ref(), file_id).await {
        Ok(Some(file)) => Ok(HttpResponse::Ok().json(FileResponse::from(file))),
        Ok(None) => Ok(HttpResponse::NotFound().json("File not found")),
        Err(e) => {
            log::error!("Failed to get file: {}", e);
            Ok(HttpResponse::InternalServerError().json("Failed to get file"))
        }
    }
}

pub async fn delete_file(
    pool: web::Data<PgPool>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let file_id = match Uuid::parse_str(&path.into_inner()) {
        Ok(id) => id,
        Err(_) => return Ok(HttpResponse::BadRequest().json("Invalid file ID")),
    };

    match file_service::delete_file(pool.get_ref(), file_id).await {
        Ok(true) => Ok(HttpResponse::Ok().json("File deleted successfully")),
        Ok(false) => Ok(HttpResponse::NotFound().json("File not found")),
        Err(e) => {
            log::error!("Failed to delete file: {}", e);
            Ok(HttpResponse::InternalServerError().json("Failed to delete file"))
        }
    }
}

pub async fn share_file(
    pool: web::Data<PgPool>,
    path: web::Path<String>,
    request: web::Json<ShareFileRequest>,
) -> Result<HttpResponse> {
    let file_id = match Uuid::parse_str(&path.into_inner()) {
        Ok(id) => id,
        Err(_) => return Ok(HttpResponse::BadRequest().json("Invalid file ID")),
    };

    let share_request = request.into_inner();
    
    match file_service::share_file(
        pool.get_ref(),
        file_id,
        &share_request.recipient_address,
        &share_request.access_level.unwrap_or_else(|| "read".to_string()),
        share_request.expires_at,
    ).await {
        Ok(share) => Ok(HttpResponse::Created().json(share)),
        Err(e) => {
            log::error!("Failed to share file: {}", e);
            Ok(HttpResponse::InternalServerError().json("Failed to share file"))
        }
    }
}

pub async fn get_shared_files(
    pool: web::Data<PgPool>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let wallet_address = path.into_inner();
    
    match file_service::get_shared_files(pool.get_ref(), &wallet_address).await {
        Ok(files) => {
            let response: Vec<FileResponse> = files.into_iter().map(FileResponse::from).collect();
            Ok(HttpResponse::Ok().json(response))
        }
        Err(e) => {
            log::error!("Failed to get shared files: {}", e);
            Ok(HttpResponse::InternalServerError().json("Failed to get shared files"))
        }
    }
}