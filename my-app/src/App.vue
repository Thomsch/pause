<script setup lang="ts">
    console.log('👋 This message is being logged by "App.vue", included via Vite');

    // TypeScript declaration for the versions object
    declare global {
        interface Window {
        versions: {
            chrome: () => string;
            node: () => string;
            electron: () => string;
        };
        }
    }

    const chrome_version = window.versions.chrome();
    const node_version = window.versions.node();
    const electron_version = window.versions.electron();
</script>

<template>
    <h1>💖 Hello World!</h1>
    <p>Welcome to your Electron application.</p>
    <p>This app is using Chrome (v{{chrome_version}}), Node.js (v{{ node_version }}), and Electron (v{{ electron_version }}).</p>
</template>
