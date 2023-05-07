module.exports = {
    apps: [
        {
            name: 'wa-store',
            script: 'index.mjs',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G'
        }
    ]
};
