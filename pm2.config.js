module.exports = {
  apps: [
    {
      name: 'API SERVER',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: true,
      env: {
        APP_PORT: 8080,
      },
    },
    {
      name: 'SCANNER SERVER',
      script: 'pnpm console scanner',
      instances: 4,
      exec_mode: 'fork',
      watch: true,
    },
  ],
}
