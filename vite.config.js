import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0', // Bind to all interfaces
        port: 5173,
        hmr: {
            port: 5173,
            host: process.env.VITE_DEV_SERVER_HOST || 'localhost',
        },
        cors: true,
    },
});
