import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import visualizer from 'rollup-plugin-visualizer';
import { createHtmlPlugin } from 'vite-plugin-html';

// reference: https://vitejs.dev/config/

export default ({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    return defineConfig({
        plugins: [
            react(),
            createHtmlPlugin({
                minify: true,
                inject: {
                    data: {
                        FRESH_CHAT_TOKEN: env['VITE_FRESH_CHAT_TOKEN'],
                    },
                },
            }),
        ],
        base: '/dashboard/',
        resolve: {
            alias: { '@': path.resolve(__dirname, 'src/') },
        },
        build: {
            rollupOptions: {
                plugins: [
                    visualizer({
                        open: true,
                        gzipSize: true,
                        brotliSize: true,
                    }),
                ],
            },
        },
    });
};
