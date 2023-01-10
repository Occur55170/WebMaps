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

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: IconsResolver({
        prefix: 'icon'  // 可以為 icon component加上前贅字來區分元件
      }),
    }),
    Icons(),//一樣定義引入的套件
  ],
//   resolve: {
//     alias: {
//       '@': resolve(__dirname, 'src'),
//     }
//   },
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
