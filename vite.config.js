import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

import { visualizer } from 'rollup-plugin-visualizer'

import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '')
  console.log('baseUrl:', env.VITE_BASE_URL)

  return {
    plugins: [
      vue(),
      vueJsx(),
      UnoCSS(),
      AutoImport({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'scss'
          }),
          // 自动导入图标组件
          IconsResolver()
        ],
        dts: false,
        imports: ['vue', 'vue-router', 'pinia'],
        eslintrc: {
          // 已存在文件设置默认 false，需要更新时再打开，防止每次更新都重新生成
          enabled: true,
          // 生成文件地址和名称
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true
        }
      }),
      Components({
        // 自动加载组件的目录配置,默认的为 'src/components'
        dirs: ['src/components'],
        dts: false,
        resolvers: [
          ElementPlusResolver({
            importStyle: 'scss'
          }),
          // 自动注册图标组件
          // 图标命名规范 {prefix}-{collection}-{icon} 例如：i-ep-add
          IconsResolver({
            // element-plus图标库，其他图标库 https://icon-sets.iconify.design/
            enabledCollections: ["ep"],
          }),
        ]
      }),
      Icons({
        // 自动安装图标库
        autoInstall: true,
      }),
      visualizer() // 构建分析工具 生成 stat.html 文件
    ],
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        // 定义全局 SCSS 变量
        scss: {
          javascriptEnabled: true,
          additionalData: `@use "@/styles/variables.scss" as *;`
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 8090,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 2000, // 消除打包大小超过500kb警告
      minify: 'esbuild'
      // minify: 'terser', // Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效
      // terserOptions: {
      //   compress: {
      //     keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
      //     drop_console: true, // 生产环境去除 console
      //     drop_debugger: true // 生产环境去除 debugger
      //   },
      //   format: {
      //     comments: false // 删除注释
      //   }
      // }
    },
    esbuild: {
      treeShaking: true,
      drop: ['debugger', 'console']
    }
  }
})
