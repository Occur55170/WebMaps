import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite' // 一樣先引入套件
import IconsResolver from 'unplugin-icons/resolver'
import cesium from 'vite-plugin-cesium'
import path from 'path' // 需安装此模块

export default defineConfig(({ mode }) => {
    // 根據當前工作目錄中的 `mode` 加載 .env 文件
    // 設置第三個參數為 '' 來加載所有環境變量，而不管是否有 `VITE_` 前綴。const config = getEnvConfig()

    const env = loadEnv(mode, process.cwd(), '')

    let baseUrl = ''
    if (process.env.BUILD_TARGET === 'WebMaps' || env.VITE_BUILD_TARGET === '/WebMaps/') {
        baseUrl = '/WebMaps'
    } else if (process.env.BUILD_TARGET === 'test') {
        baseUrl = '/test'
    } else if (env.VITE_BASE_PATH) {
        baseUrl = env.VITE_BASE_PATH.replace(/\/$/, '')
    }

    // console.log(env.NODE_ENV)
    return {
        define: {
            VITE_URL: `"${baseUrl}"`,
            VITE_APP_TITLE: `"${env.VITE_APP_TITLE}"`,
        },
        plugins: [
            vue(),
            Icons(),
            cesium(),
            Components({
                resolvers: IconsResolver({
                    prefix: 'icon',
                }),
            }),
            {
                includePaths: ['./src/styles'],
            },
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "./src/assets/styles/_variables.scss" as *;',
                },
                sass: {
                    additionalData: '@use "./src/assets/styles/_variables.scss" as *\n',
                },
            },
        },
        base: env.VITE_BASE_PATH || '/',
        build: {
            outDir: 'docs',
            sourcemap: true,
            rollupOptions: {
                output: {
                    assetFileNames: '[name].[ext]',
                },
            },
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                cesium: path.resolve(__dirname, 'node_modules/cesium/Build/CesiumUnminified'),
            },
        },
        envDir: path.resolve(__dirname, './env'),
    }
})
