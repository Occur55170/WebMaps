import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'// 一樣先引入套件
import IconsResolver from 'unplugin-icons/resolver'
import cesium from 'vite-plugin-cesium'
import path from 'path' // 需安装此模块
export default defineConfig(({ command, mode, ssrBuild }) => {
    // 根據當前工作目錄中的 `mode` 加載 .env 文件
    // 設置第三個參數為 '' 來加載所有環境變量，而不管是否有 `VITE_` 前綴。
    const ENV = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [
            vue(),
            Icons(),
            cesium(),
            Components({
                resolvers: IconsResolver({
                    prefix: 'icon'
                }),
            }),
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
            externals: { jquery: '$' },
            resolve: {
                alias: {
                    '@': fileURLToPath(new URL('./src', import.meta.url)),
                    vue: '@vue/runtime-dom'
                }
            }
        },
        // 輸出路徑設定
        // base: env.VITE_BASE, //不同模式設定不同路徑
        // base: './mapDemo',
        base: '/Map_Demo/',
        build: {
            sourcemap: true
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        },
        envDir: path.resolve(__dirname, './env')
    }
})
