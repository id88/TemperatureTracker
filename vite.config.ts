import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    base: process.env.GITHUB_ACTIONS ? '/Temperature-Tracker/' : '/',
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"), //把 src 的别名设置为 @
         },
         // 类型： string[] 导入时想要省略的扩展名列表。
         // extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.mjs']
    },
    optimizeDeps: {
        include: ['uuid']
    },
    server: {
        proxy: {
            '/weather-api': {
                target: 'https://tianqi.2345.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/weather-api/, ''),
                headers: {
                    'Referer': 'https://tianqi.2345.com',
                    'Origin': 'https://tianqi.2345.com'
                }
            }
        }
    },
    build: {
        sourcemap: 'hidden'
    }
})
