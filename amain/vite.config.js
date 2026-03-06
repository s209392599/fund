import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
// import generateRoutes from './generate-routes';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// 防止 HTML 缓存的插件
function htmlNoCachePlugin() {
  return {
    name: 'html-no-cache-plugin',
    transformIndexHtml(html) {
      return html.replace(
        /<head>/,
        `<head>
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">`
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    // 输出文件命名，添加哈希值防止缓存
    rollupOptions: {
      output: {
        // JS 文件命名
        entryFileNames: `assets/js/[name].[hash].js`,
        chunkFileNames: `assets/js/[name].[hash].js`,
        // CSS 文件命名
        assetFileNames: `assets/[ext]/[name].[hash].[ext]`,
      },
    },
    // 生成 manifest 用于服务-worker 等场景（可选）
    // manifest: true,
  },
  server: {
    host: '0.0.0.0', // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
    port: 9000,
    open: true,
    cors: true,
    https: false,
    proxy: {
      '/api': {
        target: 'http://localhost:9999',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  css: {
    // preprocessorOptions: {
    //   scss: {
    //     // src/assets/css/variables.scss
    //     additionalData: `@import "@/styles/variables.scss";`, // 引入全局变量文件
    //   },
    // },
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
    htmlNoCachePlugin(), // 添加防缓存插件
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
    // 打包时复制静态文件
    viteStaticCopy({
      targets: [
        // { src: 'src/assets/html/a.html', dest: 'example' },// 复制到dist/example/a.html
        { src: 'src/assets/html/a.html', dest: '' },
        { src: 'src/assets/html/b.html', dest: '' },
      ],
    }),
  ],
});
