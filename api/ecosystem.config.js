module.exports = {
  dev: 'pm2 start ecosystem.config.js --watch',
  apps: [
    {
      name: 'fund_api',
      desc: '基金接口',
      script: './app.js',
      watch: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z', // 时间格式
      watch: ['app.js', 'routes/**/*.js'], // 监控 app.js 和 routes 下所有文件
      force: true, // 确保覆盖默认监听规则
      ignore_watch: ['node_modules','static/*'], // 明确忽略 node_modules
      watch_options: {
        followSymlinks: false, // 禁用符号链接（可选）
        usePolling: true, // 强制轮询（解决部分文件系统问题）
      },
      env: {
        PM2_LOGROTATE_MAX_SIZE: '100M', // 设置单个日志文件的最大大小为 100MB
        PM2_LOGROTATE_RETAIN: '30', // 设置保留的最近日志文件数量为 30 个
      },
    },
    {
      name: 'timer',
      desc: '关于基金的定时任务(获取一些涨幅数据等)',
      script: './timer.js',
      log_date_format: 'YYYY-MM-DD HH:mm Z', // 时间格式
      time: true, // 显示时间戳

      // ---------------------- 下面是一个组合，现在用watch直接替代
      watch: ['timer.js','static/*'], // 仅监控 timer.js 文件
      force: true, // 确保覆盖默认监听规则
      // watch: true,
      // ignore_watch: [
      //   '**/*', // 忽略所有文件
      //   '!timer.js', // 但不忽略 timer.js
      // ],
      // -----------------------
      env: {
        PM2_LOGROTATE_MAX_SIZE: '100M', // 设置单个日志文件的最大大小为 100MB
        PM2_LOGROTATE_RETAIN: '30', // 设置保留的最近日志文件数量为 30 个
      },
    },
  ],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
