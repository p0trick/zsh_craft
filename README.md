# Zsh Craft - Zsh 配置生成器

一个现代化的 Zsh 配置管理工具，提供直观的 Web 界面来管理和生成 `.zshrc` 配置文件。

## 🚀 功能特性

### 核心功能
- **可视化配置管理**: 通过 Web 界面轻松管理 Zsh 配置
- **实时配置应用**: 配置修改后自动应用，无需手动操作
- **插件管理**: 支持 Zinit 插件系统的配置和管理
- **别名管理**: 可视化添加、编辑和管理 Shell 别名
- **环境变量**: 管理 PATH 变量和环境变量
- **Zsh 选项**: 配置 Zsh 的各种选项和设置
- **初始化脚本**: 自定义 Zsh 初始化脚本

### 技术特性
- **现代化 UI**: 基于 Ant Design 的美观界面
- **实时预览**: 实时预览生成的 `.zshrc` 内容
- **自动备份**: 自动创建配置文件备份
- **跨平台**: 支持 macOS、Linux 等系统
- **响应式设计**: 适配不同屏幕尺寸

## 🏗️ 项目架构

```
zsh_craft/
├── backend/                 # Go 后端服务
│   ├── main.go             # 主服务文件
│   └── go.mod              # Go 模块文件
├── frontend/               # React 前端应用
│   ├── src/
│   │   ├── components/     # React 组件
│   │   ├── pages/         # 页面组件
│   │   ├── context/       # React Context
│   │   ├── utils/         # 工具函数
│   │   └── config/        # 配置文件
│   ├── public/            # 静态资源
│   └── package.json       # 前端依赖
└── README.md              # 项目说明
```

## 📋 系统要求

- **Node.js**: 16.0 或更高版本
- **Go**: 1.24 或更高版本
- **操作系统**: macOS、Linux

## 🛠️ 安装和运行

### 1. 克隆项目

```bash
git clone <repository-url>
cd zsh_craft
```

### 2. 安装前端依赖

```bash
cd frontend
npm install
```

### 3. 安装后端依赖

```bash
cd ../backend
go mod tidy
```

### 4. 启动开发服务器

#### 方式一：分别启动前后端

```bash
# 启动后端服务 (在 backend 目录)
go run main.go

# 启动前端开发服务器 (在 frontend 目录)
npm start
```

#### 方式二：构建并启动生产版本

```bash
# 在 frontend 目录构建
npm run build

# 在 backend 目录启动
go run main.go
```

### 5. 访问应用

打开浏览器访问: http://localhost:8080

## 📖 使用说明

### 主要功能模块

#### 1. Zinit 初始化配置
- 配置 Homebrew 路径
- 设置 Zinit 安装路径
- 管理 Zinit 初始化脚本

#### 2. 别名管理
- 添加、编辑、删除 Shell 别名
- 支持别名分类和描述
- 实时预览别名效果

#### 3. 环境变量管理
- 管理 PATH 变量
- 添加自定义环境变量
- 支持变量优先级设置

#### 4. 插件管理
- 添加 Zinit 插件
- 配置插件选项
- 管理插件加载顺序

#### 5. Zsh 选项配置
- 配置 Zsh 内置选项
- 支持选项分类管理
- 实时预览选项效果

#### 6. 初始化脚本
- 编写自定义初始化脚本
- 支持多行脚本编辑
- 语法高亮显示

### 操作流程

1. **配置 Zinit**: 首先配置 Zinit 初始化设置
2. **添加插件**: 根据需要添加 Zinit 插件
3. **设置别名**: 添加常用的 Shell 别名
4. **配置环境**: 设置 PATH 和环境变量
5. **调整选项**: 配置 Zsh 选项
6. **预览配置**: 查看生成的 `.zshrc` 内容
7. **应用配置**: 配置会自动应用（生产环境）

## 🔧 配置说明

### 环境配置

项目支持开发和生产环境的不同配置：

- **开发环境**: 显示导入/导出按钮，配置保存到 localStorage
- **生产环境**: 启用自动保存，配置保存到服务器

### 文件结构

应用会在用户主目录创建以下文件：

```
~/
├── .zshrc                    # 生成的 Zsh 配置文件
├── .zsh_cfg/                 # 配置目录
│   ├── zsh_config.json      # 配置文件
│   └── zsh_config.json.backup # 备份文件
```

## 🚀 部署

### 生产环境部署

1. **构建前端**:
   ```bash
   cd frontend
   npm run build
   ```

2. **启动后端服务**:
   ```bash
   cd backend
   go run main.go
   ```

3. **配置反向代理** (可选):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:8080;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## 🔍 API 接口

### 后端 API 端点

- `POST /api/apply_config`: 应用配置到系统
- `GET /api/load_config`: 加载保存的配置
- `POST /api/save_config`: 保存配置到文件

### 请求格式

```json
{
  "zshrc_content": "生成的 zshrc 内容",
  "zsh_config": "配置的 JSON 字符串"
}
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🆘 常见问题

### Q: 配置修改后没有生效？
A: 请确保：
- 后端服务正在运行
- 检查浏览器控制台是否有错误信息
- 确认网络连接正常

### Q: 如何备份现有配置？
A: 应用会自动创建 `.backup` 文件，也可以手动备份 `~/.zshrc` 文件

### Q: 支持哪些 Zsh 插件？
A: 支持所有 Zinit 插件，包括 GitHub 插件、本地插件等

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 参与讨论

---

**Zsh Craft** - 让 Zsh 配置管理变得简单高效 🎉 