# Zsh Craft Frontend

Zsh Craft 项目的前端部分，基于 React + TypeScript + Ant Design 构建的现代化 Web 应用。

## 🚀 技术栈

- **React 19**: 现代化的 React 框架
- **TypeScript**: 类型安全的 JavaScript
- **Ant Design**: 企业级 UI 组件库
- **React Router**: 客户端路由管理
- **Tailwind CSS**: 实用优先的 CSS 框架
- **js-yaml**: YAML 文件处理

## 📦 安装依赖

```bash
npm install
```

## 🛠️ 开发命令

### 启动开发服务器
```bash
npm start
```
应用将在 http://localhost:3000 启动

### 构建生产版本
```bash
npm run build
```
构建完成后会自动将文件移动到 `../backend/dist` 目录

### 运行测试
```bash
npm test
```

### 代码检查
```bash
npm run lint
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── AliasTable.tsx      # 别名管理表格
│   ├── ConfigPreviewModal.tsx  # 配置预览弹窗
│   ├── EnvVarTable.tsx     # 环境变量表格
│   ├── InitScriptEditor.tsx    # 初始化脚本编辑器
│   ├── PathVarTable.tsx    # PATH变量表格
│   ├── Sidebar.tsx         # 侧边栏导航
│   ├── Topbar.tsx          # 顶部工具栏
│   └── ZshOptionTable.tsx  # Zsh选项表格
├── pages/              # 页面组件
│   ├── Home.tsx            # 首页
│   ├── ZinitInit.tsx       # Zinit初始化
│   ├── Alias.tsx           # 别名管理
│   ├── EnvVar.tsx          # 环境变量
│   ├── PathVar.tsx         # PATH变量
│   ├── Plugin.tsx          # 插件管理
│   ├── PluginDetail.tsx    # 插件详情
│   ├── ZshOption.tsx       # Zsh选项
│   └── InitScript.tsx      # 初始化脚本
├── context/            # React Context
│   └── ConfigContext.tsx   # 配置状态管理
├── utils/              # 工具函数
│   ├── configSchema.ts     # 配置类型定义
│   ├── yamlLoader.ts       # YAML文件加载器
│   └── zshrcGenerator.ts   # zshrc生成器
├── config/             # 配置文件
│   └── appConfig.ts        # 应用配置
├── assets/             # 静态资源
│   ├── alias.yaml          # 别名配置模板
│   ├── plugins.yaml        # 插件配置模板
│   └── zsh_options.yaml    # Zsh选项模板
└── App.tsx             # 主应用组件
```

## 🔧 配置说明

### 环境配置 (`src/config/appConfig.ts`)

```typescript
export const appConfig = {
  // 是否显示导入导出按钮 - 只在开发环境显示
  showImportExport: process.env.NODE_ENV !== 'production',
  
  // 是否启用自动保存 - 只在生产环境启用
  autoSave: process.env.NODE_ENV === 'production',
  
  // 其他配置选项
  features: {
    preview: true,    // 是否启用配置预览
    download: true,   // 是否启用配置下载
  }
};
```

### 开发环境特性
- 显示导入/导出按钮
- 配置保存到 localStorage
- 热重载开发服务器

### 生产环境特性
- 隐藏导入/导出按钮
- 启用自动保存到服务器
- 优化的构建版本

## 🎨 UI 组件

### 主要组件

1. **Topbar**: 顶部工具栏，包含导入/导出、预览、下载功能
2. **Sidebar**: 侧边栏导航，提供各功能模块的快速访问
3. **ConfigPreviewModal**: 配置预览弹窗，显示生成的 zshrc 内容
4. **各种表格组件**: 管理别名、环境变量、PATH变量、Zsh选项等

### 主题配置

应用使用自定义的 Ant Design 主题：

```typescript
const themeConfig = {
  token: {
    colorPrimary: '#6b7280',      // 主色调
    colorPrimaryHover: '#9ca3af', // 悬停色
    colorPrimaryActive: '#4b5563', // 激活色
  },
  components: {
    Menu: {
      itemSelectedBg: '#6b7280',
      itemHoverBg: '#9ca3af',
      itemActiveBg: '#6b7280',
      itemSelectedColor: '#ffffff',
      itemColor: '#374151',
    },
  },
};
```

## 🔄 状态管理

使用 React Context 进行状态管理：

- **ConfigContext**: 管理整个应用的配置状态
- **自动保存**: 配置变化时自动保存到服务器或 localStorage
- **实时同步**: 所有组件实时响应配置变化

## 📡 API 集成

### 主要 API 调用

1. **应用配置**: `POST /api/apply_config`
2. **加载配置**: `GET /api/load_config`
3. **保存配置**: `POST /api/save_config`

### 错误处理

- 网络错误提示
- 加载状态显示
- 用户友好的错误消息

## 🧪 测试

### 运行测试
```bash
npm test
```

### 测试覆盖率
```bash
npm test -- --coverage
```

## 📦 构建和部署

### 开发构建
```bash
npm run build
```

### 生产构建
```bash
NODE_ENV=production npm run build
```

构建完成后，文件会自动移动到 `../backend/dist` 目录，供后端服务使用。

## 🐛 调试

### 开发工具
- React Developer Tools
- Redux DevTools (如果使用)
- 浏览器开发者工具

### 常见问题
1. **端口冲突**: 如果 3000 端口被占用，会自动使用其他端口
2. **API 连接**: 确保后端服务在 8080 端口运行
3. **CORS 问题**: 开发环境已配置代理

## 📝 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 组件使用函数式组件和 Hooks

## 🤝 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

---

**Zsh Craft Frontend** - 现代化的 Zsh 配置管理界面 🎨
