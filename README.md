# vue3-js-elementPlus-admin

使用 vite + vue3 + vue-router + pinia + elementPlus + eslint + prettier + unocss + commitlint 搭建的通用后台管理系统。部分思路参考 [vue-element-admin](https://panjiachen.github.io/vue-element-admin-site/zh/guide/)

## 编辑器设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur)

## vite 配置

[Vite](https://cn.vitejs.dev/)下一代的前端工具链 ，为开发提供极速响应。

Vite（法语意为 "快速的"，发音 /vit/，发音同 "veet"）是一种新型前端构建工具，能够显著提升前端开发体验。它主要由两部分组成：

- 一个开发服务器，它基于 **_原生 ES 模块_** 提供了 丰富的内建功能，如速度快到惊人的 模块热更新（HMR）。
- 一套构建指令，它使用 **_Rollup_** 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。

根据 vite 官网的介绍，我们需要把握两个重点，一个是 [esbuild](https://esbuild.bootcss.com/getting-started/),另一个就是 [Rollup](https://cn.rollupjs.org/command-line-interface/)。

## 安装

```sh
npm install
```

### 开发模式

```sh
npm run dev
```

### 打包

```sh
npm run build
```

### eslint & prettier 修复代码

```sh
npm run check-files
```

### 提交代码

```sh
npm run commit
```

### 插件使用指南

[vue3](https://cn.vuejs.org/guide/introduction.html)

[vue-router](https://router.vuejs.org/zh/)

[pinia](https://pinia.vuejs.org/zh/introduction.html)

[element-plus](https://element-plus.org/zh-CN/)

[unocss](https://unocss.dev/guide/)

[unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import)

[unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components)

[pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/)

### 自动引入 vue 相关的 api

```js
// vite.config.js
import AutoImport from 'unplugin-auto-import/vite';

// 省略无关代码

// 配置插件
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        AutoImport({
            // 支持自动导入 api 规则的相关文件
            // 默认支持 .ts, .tsx, .js, .jsx .vue
            include: [
                /\.[tj]sx?$/, // ts, .tsx, .js, .jsx
                /\.vue$/,
                /\.vue\?vue/, // .vue
                /\.md$/ // .md
            ],
            imports: ['vue', 'vue-router', 'pinia'] // 自动导入vue、vue-router、pinia 内的部分api
            eslintrc: {
                // 已存在文件设置默认 false，需要更新时再打开，防止每次更新都重新生成
                enabled: true,
                // 生成文件地址和名称
                filepath: './.eslintrc-auto-import.json',
                globalsPropValue: true
            }
        }),
    ],
})
```

如图所示：

![修改代码](https://rookie-files.oss-cn-shanghai.aliyuncs.com/Xnip2023-09-06_16-40-23.jpg)

### 自动引入组件

```js
// vite.config.js
import Components from 'unplugin-vue-components/vite'

// 省略无关代码

// 配置插件
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        Components({
          // 自动加载组件的目录配置,默认的为 'src/components'
          dirs: ['src/components'],
          dts: false,
          resolvers: [
            // element plus 插件使用
            ElementPlusResolver({
              importStyle: 'scss'
            })
          ]
        })
    ]
})
```

