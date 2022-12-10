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
})