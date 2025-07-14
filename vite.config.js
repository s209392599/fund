import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
// import generateRoutes from './generate-routes';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0', // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
    port: 9000,
    open: true,
    cors: true,
    https: false,
    proxy: {
      // '/api': {
      //   target: setting.VUE_APP_BASE_API,
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ''),
      // },
    },
  },
  css: {
    // preprocessorOptions: {
    //   less: {
    //     modifyVars: {
    //       hack: `true; @import (reference) "${resolve(
    //         'src/assets/css/lessVariable.less'
    //       )}";`,
    //     },
    //     javascriptEnabled: true,
    //   },
    // },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [
    vue(),
    // generateRoutes(),
    AutoImport({
      imports: ['vue', 'vue-router'], // 自动导入 pinia
      dirs: ['./src/utils/**', './src/api/**'],
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      resolvers: [ElementPlusResolver()],
      vueTemplate: true, // 在vue中使用，默认false
    }),
    Components({
      dirs: ['src/views', 'src/components'],
      resolvers: [ElementPlusResolver()],
      // resolvers: [
      //   ElementPlusResolver({
      //     importStyle: mode === 'development' ? false : 'sass',
      //   }),
      // ],
    }),
  ],
});
