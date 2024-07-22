use actix_web::{web, HttpResponse, Result};
use sqlx::PgPool;

use crate::models::{CreateUserRequest, UserResponse};
use crate::services::user_service;

pub async fn create_user(
    pool: web::Data<PgPool>,
    request: web::Json<CreateUserRequest>,
) -> Result<HttpResponse> {
    match user_service::create_user(pool.get_ref(), &request.wallet_address).await {
        Ok(user) => Ok(HttpResponse::Created().json(UserResponse::from(user))),
        Err(e) => {
            log::error!("Failed to create user: {}", e);
            Ok(HttpResponse::InternalServerError().json("Failed to create user"))
        }
    }
}

pub async fn get_user(
    pool: web::Data<PgPool>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let wallet_address = path.into_inner();
    
    match user_service::get_user(pool.get_ref(), &wallet_address).await {
        Ok(Some(user)) => Ok(HttpResponse::Ok().json(UserResponse::from(user))),
        Ok(None) => Ok(HttpResponse::NotFound().json("User not found")),
        Err(e) => {
            log::error!("Failed to get user: {}", e);
            Ok(HttpResponse::InternalServerError().json("Failed to get user"))
        }
    }
}

pub async fn get_user_stats(
    pool: web::Data<PgPool>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let wallet_address = path.into_inner();
    
    match user_service::get_user_stats(pool.get_ref(), &wallet_address).await {
        Ok(stats) => Ok(HttpResponse::Ok().json(stats)),
        Err(e) => {
            log::error!("Failed to get user stats: {}", e);
            Ok(HttpResponse::InternalServerError().json("Failed to get user stats"))
        }
    }
}