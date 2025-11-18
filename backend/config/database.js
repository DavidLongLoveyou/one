"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Database Configuration
 * 
 * PostgreSQL is REQUIRED for production according to roadmap.txt
 * SQLite is only for quick local testing (not recommended)
 */

const config = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'postgres');
  
  if (client === 'postgres') {
    // PostgreSQL configuration (PRODUCTION & RECOMMENDED FOR LOCAL)
    const sslEnabled = env.bool('DATABASE_SSL', false);
    const sslRejectUnauthorized = env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false);
    
    return {
      connection: {
        client: 'postgres',
        connection: {
          host: env('DATABASE_HOST', 'localhost'),
          port: env.int('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME', 'thegreatbeans'),
          user: env('DATABASE_USERNAME', 'strapi'),
          password: env('DATABASE_PASSWORD', ''),
          ssl: sslEnabled && {
            rejectUnauthorized: sslRejectUnauthorized
          },
        },
        pool: {
          min: env.int('DATABASE_POOL_MIN', 2),
          max: env.int('DATABASE_POOL_MAX', 10),
        },
        acquireConnectionTimeout: env.int('DATABASE_ACQUIRE_TIMEOUT', 60000),
      },
    };
  }
  
  // SQLite fallback (for quick testing only - NOT recommended)
  console.warn('⚠️  WARNING: Using SQLite. PostgreSQL is required for production!');
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: env('DATABASE_FILENAME', '.tmp/data.db'),
      },
      useNullAsDefault: true,
    },
  };
};

exports.default = config;
