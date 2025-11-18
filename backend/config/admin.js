"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ env }) => ({
    auth: {
        secret: env('ADMIN_JWT_SECRET'),
        sessions: {
            maxRefreshTokenLifespan: env.int('ADMIN_MAX_REFRESH_TOKEN_LIFESPAN', 2592000000),
            maxSessionLifespan: env.int('ADMIN_MAX_SESSION_LIFESPAN', 604800000),
        },
    },
    apiToken: {
        salt: env('API_TOKEN_SALT'),
    },
    transfer: {
        token: {
            salt: env('TRANSFER_TOKEN_SALT'),
        },
    },
    flags: {
        nps: env.bool('FLAG_NPS', true),
        promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },
    build: {
        vite: {
            resolve: {
                alias: {
                    'zod/v3': 'zod',
                    'zod/v4': 'zod',
                },
            },
            optimizeDeps: {
                exclude: ['zod/v3', 'zod/v4'],
            },
            ssr: {
                external: ['zod/v3', 'zod/v4'],
            },
        },
    },
});
