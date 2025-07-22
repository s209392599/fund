const path = require('path');
module.exports = {
  publicPath: './',
  outputDir: 'dist',
  // outputDir: __dirname,
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        target:
          'http://775477fdb4134cd5924c62381cf95ed0.apig.cn-east-3.huaweicloudapis.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '/fund' }, // 确保重写路径正确
      },
    },
  },
};
