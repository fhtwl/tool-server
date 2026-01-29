// pm2 配置
module.exports = {
  apps: [
    {
      name: 'tool-service',
      script: 'dist/main.js',
      args: '',
      instances: 1,
      autorestart: true,
      watch: true,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
