// module.exports = {
//   publicPath: process.env.NODE_ENV === 'production'
//     ? '/WebMaps/'
//     : '/'
// }

//vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'//一樣先引入套件
import IconsResolver from 'unplugin-icons/resolver'
import cesium from 'vite-plugin-cesium';

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: IconsResolver({
        prefix: 'icon'
      }),
    }),
    Icons(),
    cesium()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/assets/styles/global.scss";',
        javascriptEnabled: true
      }
    }
  },
  // 輸出路徑設定
//   base: "/Map_Demo"
    base: '.',
})
