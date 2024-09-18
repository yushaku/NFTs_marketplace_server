module.exports = {
  apps: [
    {
      name: 'API SERVER',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'cluster',
      watch: true,
      env: {
        APP_PORT: 8080,
      },
    },
  ],
}
