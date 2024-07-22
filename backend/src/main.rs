mod models;
mod handlers;
mod services;
mod utils;

use actix_web::{web, App, HttpServer, middleware::Logger};
use actix_cors::Cors;
use sqlx::PgPool;
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    dotenv::dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    
    let pool = PgPool::connect(&database_url)
        .await
        .expect("Failed to connect to database");

    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    let port = env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse::<u16>()
        .expect("PORT must be a valid number");

    println!("🚀 Server starting on port {}", port);

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(cors)
            .wrap(Logger::default())
            .service(
                web::scope("/api")
                    .service(
                        web::scope("/files")
                            .route("", web::post().to(handlers::files::create_file))
                            .route("/user/{wallet_address}", web::get().to(handlers::files::get_user_files))
                            .route("/{file_id}", web::get().to(handlers::files::get_file_by_id))
                            .route("/{file_id}", web::delete().to(handlers::files::delete_file))
                            .route("/{file_id}/share", web::post().to(handlers::files::share_file))
                            .route("/shared/{wallet_address}", web::get().to(handlers::files::get_shared_files))
                    )
                    .service(
                        web::scope("/users")
                            .route("", web::post().to(handlers::users::create_user))
                            .route("/{wallet_address}", web::get().to(handlers::users::get_user))
                            .route("/{wallet_address}/stats", web::get().to(handlers::users::get_user_stats))
                    )
                    .service(
                        web::scope("/health")
                            .route("", web::get().to(handlers::health::health_check))
                    )
            )
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}