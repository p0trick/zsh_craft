# Zsh Craft 快速开始指南

本指南将帮助您快速上手 Zsh Craft 项目。

## 🚀 5分钟快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd zsh_craft
```

### 2. 安装依赖
```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
go mod tidy
```

### 3. 启动服务
```bash
# 启动后端服务
cd backend
go run main.go
```

### 4. 访问应用
打开浏览器访问: http://localhost:8080

## 📋 系统要求检查

### 检查 Node.js 版本
```bash
node --version  # 需要 16.0+
```

### 检查 Go 版本
```bash
go version     # 需要 1.24+
```

### 检查操作系统
```bash
uname -s       # 支持 macOS, Linux
```

## 🛠️ 开发环境设置

### 前端开发
```bash
cd frontend
npm start      # 启动开发服务器 (http://localhost:3000)
```

### 后端开发
```bash
cd backend
go run main.go # 启动后端服务 (http://localhost:8080)
```

### 同时运行前后端
```bash
# 终端 1: 启动后端
cd backend && go run main.go

# 终端 2: 启动前端
cd frontend && npm start
```

## 📖 基本使用

### 1. 配置 Zinit
- 访问 http://localhost:8080
- 点击左侧 "Zinit 初始化"
- 配置 Homebrew 路径和 Zinit 安装路径

### 2. 添加插件
- 点击 "插件管理"
- 点击 "添加插件"
- 输入插件名称和配置

### 3. 设置别名
- 点击 "别名管理"
- 点击 "添加别名"
- 输入别名名称和命令

### 4. 预览配置
- 点击顶部 "预览zshrc"
- 查看生成的配置文件内容

### 5. 应用配置
- 配置会自动保存和应用（生产环境）
- 或点击 "下载zshrc" 手动下载

## 🔧 常见配置

### 常用别名示例
```bash
# 开发相关
alias gst="git status"
alias gco="git checkout"
alias gpl="git pull"
alias gps="git push"

# 系统相关
alias ll="ls -la"
alias la="ls -A"
alias l="ls -CF"

# 目录相关
alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
```

### 常用环境变量
```bash
# 开发工具路径
export PATH="/usr/local/bin:$PATH"
export PATH="/opt/homebrew/bin:$PATH"

# 编辑器设置
export EDITOR="vim"
export VISUAL="vim"

# 语言设置
export LANG="en_US.UTF-8"
export LC_ALL="en_US.UTF-8"
```

### 常用 Zsh 选项
```bash
# 历史记录
setopt HIST_IGNORE_ALL_DUPS
setopt HIST_SAVE_NO_DUPS
setopt HIST_REDUCE_BLANKS

# 自动补全
setopt AUTO_CD
setopt AUTO_PUSHD
setopt PUSHD_IGNORE_DUPS

# 其他
setopt EXTENDED_GLOB
setopt NOTIFY
setopt PROMPT_SUBST
```

## 🐛 故障排除

### 端口被占用
```bash
# 检查端口使用情况
lsof -i :8080
lsof -i :3000

# 杀死占用进程
kill -9 <PID>
```

### 权限问题
```bash
# 检查文件权限
ls -la ~/.zshrc

# 修复权限
chmod 644 ~/.zshrc
```

### 网络连接问题
```bash
# 检查后端服务
curl http://localhost:8080/api/load_config

# 检查前端服务
curl http://localhost:3000
```

### 构建问题
```bash
# 清理缓存
cd frontend
rm -rf node_modules package-lock.json
npm install

# 重新构建
npm run build
```

## 📚 下一步

### 深入学习
- 阅读 [完整 README](README.md)
- 查看 [前端文档](frontend/README.md)
- 查看 [后端文档](backend/README.md)

### 自定义配置
- 修改主题颜色
- 添加自定义插件
- 配置高级选项

### 贡献代码
- 查看 [贡献指南](README.md#贡献指南)
- 提交 Issue 或 Pull Request
- 参与社区讨论

## 🆘 获取帮助

- 📖 [完整文档](README.md)
- 🐛 [提交 Issue](https://github.com/your-repo/issues)
- 💬 [社区讨论](https://github.com/your-repo/discussions)
- 📧 [邮件联系](mailto:your-email@example.com)

---

**开始使用 Zsh Craft，让您的 Zsh 配置管理变得简单高效！** 🎉 