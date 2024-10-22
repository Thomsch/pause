import { defineConfig } from 'vite';
import VuePlugin from '@vitejs/plugin-vue';

// https://vitejs.dev/config
/** @type {import('vite').UserConfig} */
export default defineConfig({
    plugins: [VuePlugin()]
});