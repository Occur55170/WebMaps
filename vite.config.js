import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite' // 一樣先引入套件
import IconsResolver from 'unplugin-icons/resolver'
import cesium from 'vite-plugin-cesium'
import path from 'path' // 需安装此模块

function getBasePath(){
    if (process.env.BUILD_TARGET === 'mapDemo'){
        return '/Map_Demo'
    } else if (process.env.BUILD_TARGET === 'test'){
        return '/test'
    } else{
        return ''
    }
}

export default defineConfig(({ mode }) => {
    // 根據當前工作目錄中的 `mode` 加載 .env 文件
    // 設置第三個參數為 '' 來加載所有環境變量，而不管是否有 `VITE_` 前綴。const config = getEnvConfig()

    const env = loadEnv(mode, process.cwd(), '')
    // console.log(env.NODE_ENV)
    // import.meta.env.
    return {
        define: {
            VITE_UPLOAD_URL: '"https://img.jgbsmart.com"',
            VITE_URL: `"${getBasePath()}"`,
            VITE_APP_TITLE: `"${env.VITE_APP_TITLE}"`,
            VITE_APP_TEST: '"999"',
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
                    additionalData: '@import "./src/assets/styles/global.module.scss";',
                    javascriptEnabled: true,
                },
            },
        },
        configureWebpack: {
            externals: { jquery: '$' },
            resolve: {
                alias: {
                    '@': fileURLToPath(new URL('./src', import.meta.url)),
                    vue: '@vue/runtime-dom',
                },
            },
        },
        base: `${process.env.BUILD_TARGET === 'mapDemo' ? '/Map_Demo' : '/'}`,
        build: {
            sourcemap: true,
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        envDir: path.resolve(__dirname, './env'),
        server: {
            host: '0.0.0.0', // 允許來自任何主機的連接
            port: 5173, // 設定端口為 5137
        },
    }
})
