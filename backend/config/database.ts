import type { DatabaseConfig } from '@strapi/database';

const config: DatabaseConfig = {
  connection: {
    client: process.env.DATABASE_CLIENT || 'sqlite',
    connection:
      process.env.DATABASE_CLIENT === 'postgres'
        ? {
            host: process.env.DATABASE_HOST || 'localhost',
            port: parseInt(process.env.DATABASE_PORT || '5432', 10),
            database: process.env.DATABASE_NAME || 'thegreatbeans',
            user: process.env.DATABASE_USERNAME || 'postgres',
            password: process.env.DATABASE_PASSWORD || '',
            ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
          }
        : {
            filename: process.env.DATABASE_FILENAME || '.tmp/data.db',
          },
    useNullAsDefault: true,
  },
};

export default config;

