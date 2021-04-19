## PerFee 物流后台
项目使用Vue3 + element-plus构建

### 相关文档：

[vue3中文官方文档](https://vue3js.cn/docs/zh/)

[element-plus官方文档](https://element-plus.gitee.io/#/zh-CN/component/installation)

[loadsh官方文档](https://www.lodashjs.com/)

### 环境构建
```
npm install || yarn install
```

```
npm run serve || yarn serve // RUN_NODE_ENV = dev
```

```
npm run build || yarn build // RUN_NODE_ENV = prod
```

### 基础规范及注意事项
```
1. 组件规范：
    1) 请使用最新的组合式api setup() 进行组件的实现
    2) 组件命名使用 大驼峰，例：BetterScroll.vue（不要写成betterScroll.vue 或 better-scroll.vue）
    3）模板中使用自定义组件使用 大驼峰(<BetterScroll>, 有利于编辑器提示)，element组件使用 <el-col></el-col>
    4) 组件的props请定义格式
2. js规范：
    1) 尽量使用es语法
    2) 遵循eslint规范
3. css规范：
    1) css请统一使用scss
    2) 除非特殊需要，一般情况下组件样式请加<style scoped></style>
    3) 非必要情况下请不要随意定义全局 css样式
    4) 全局css样式请增加统一前缀：sx-xxx
4. 其他
    · vue-router、vuex、api 等请按照需求进行模块拆分，非公共模块请不要写在index.js中
    · 变量、国际化、常量、方法命名请语义化，不要使用简拼、首字母简写等非人类操作，常量命名单词全部大写，下划线分割
    · loadsh请按需引入（因为整个loadsh库体积较大，且不需要使用到所有的方法）
```

### 路由配置（目前最多只支持三级菜单【后续有需求的话会对sidebar进行改造】）
![avatar](/md-img/md-01.png)
```js
// 配置示例：
export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      title: '系统首页', icon: 'el-icon-lx-home'
    },
    component: () => import('@/views/Dashboard.vue')
  },
  {
    title: 'Test', // 一级菜单名称
    icon: 'el-icon-lx-home', // 一级菜单目录
    children: [
        // 二级菜单
      {
        // 路由path 、 name
        path: '/test',
        name: 'test',
        meta: {
          // 最后一级菜单的 信息需要配置在 meta 元信息中
          title: 'test', icon: 'el-icon-lx-home'
        },
        // 组件：尽量使用懒加载
        component: () => import('@/views/Dashboard.vue'),
        // 可以配置三级菜单
        // children: []
      }
    ]
  }
]
```

### 基础目录结构
```
perfee-manage-system
├─ .eslintrc.js // eslint规则配置
├─ .gitignore // git版本管理配置
├─ babel.config.js // babel插件配置
├─ jsconfig.json // vscode别名相关配置
├─ package.json // 包管理
├─ README.md // 项目说明文档
├─ README_EN.md
├─ src // 项目根目录
│  ├─ api // 所有的项目接口调用全部走这个目录
│  │  └─ index.js
│  ├─ App.vue // Vue根组件
│  ├─ assets // 静态资源目录
│  │  ├─ css
│  │  │  ├─ common.scss
│  │  │  ├─ icon.css
│  │  │  ├─ main.css
│  │  │  └─ theme
│  │  │     ├─ header.scss
│  │  │     ├─ mixin.scss
│  │  │     └─ sidebar.scss
│  │  └─ img
│  │     ├─ img.jpg
│  │     └─ login-bg.jpg
│  ├─ components // 通用组件模块
│  ├─ lang // 国际化模块
│  │  ├─ en
│  │  │  └─ system-languages.js
│  │  ├─ index.js
│  │  └─ zh-cn
│  │     └─ system-languages.js
│  ├─ layout // 后台框架布局
│  │  ├─ img
│  │  │  ├─ header-theme-dark.svg
│  │  │  ├─ header-theme-primary.svg
│  │  │  ├─ nav-theme-dark.svg
│  │  │  └─ nav-theme-light.svg
│  │  ├─ index.vue
│  │  └─ widgets
│  │     ├─ Header.vue
│  │     ├─ Sidebar.vue
│  │     ├─ Tags.vue
│  │     └─ Theme.vue
│  ├─ main.js // Vue项目入口
│  ├─ router // Vue路由
│  │  ├─ index.js
│  │  └─ modules // 模块路由
│  │     └─ system-routers.js
│  ├─ store // Vuex全局项目管理
│  │  ├─ index.js
│  │  └─ modules // Vuex全局状态模块化
│  │     └─ home.js
│  ├─ utils // 项目工具库
│  │  ├─ browserStore.js // store.js
│  │  ├─ permission.js // 权限
│  │  ├─ plugins.js // 项目插件
│  │  ├─ request.js // axios请求
│  │  └─ utils.js // 工具库
│  └─ views // 项目的页面
│     ├─ 403.vue
│     ├─ 404.vue
│     ├─ Dashboard.vue
│     └─ Login.vue
├─ vue.config.js // webpack相关配置信息
```