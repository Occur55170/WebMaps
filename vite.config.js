// module.exports = {
//   publicPath: process.env.NODE_ENV === 'production'
//     ? '/WebMaps/'
//     : '/'
// }

//vite.config.js
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'//一樣先引入套件
import IconsResolver from 'unplugin-icons/resolver'
import cesium from 'vite-plugin-cesium';
export default defineConfig(({ command, mode, ssrBuild }) => {
    // 根據當前工作目錄中的 `mode` 加載 .env 文件
    // 設置第三個參數為 '' 來加載所有環境變量，而不管是否有 `VITE_` 前綴。
    const env = loadEnv(mode, process.cwd())
    console.log(env.VITE_BASE); //輸出VITE_BASE的環境變數
    return {
        plugins: [
            vue(),
            Components({
                resolvers: IconsResolver({
                    prefix: 'icon'
                }),
            }),
            Icons(),
            cesium(),
            // 'vite-plugin-sass',
            {
              includePaths: ['./src/styles']
            }
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "./src/assets/styles/global.module.scss";',
                    javascriptEnabled: true
                }
            }
        },
        configureWebpack: {
            externals: { 'jquery': '$' },
            resolve: {
                alias: {
                    'vue': '@vue/runtime-dom'
                }
            }
        },
        // 輸出路徑設定
        // base: env.VITE_BASE, //不同模式設定不同路徑
        base: '/Map_Demo/',
        // base: './',
    }
})
