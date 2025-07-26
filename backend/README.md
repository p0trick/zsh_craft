# Zsh Craft Backend

Zsh Craft 项目的后端服务，基于 Go 语言构建的轻量级 Web 服务器。

## 🚀 技术栈

- **Go 1.24+**: 高性能的编程语言
- **标准库**: 使用 Go 标准库构建 HTTP 服务
- **嵌入式文件系统**: 使用 `embed` 包嵌入前端静态文件
- **JSON 处理**: 原生 JSON 编解码
- **文件操作**: 安全的文件读写操作

## 📦 安装依赖

```bash
go mod tidy
```

## 🛠️ 开发命令

### 启动开发服务器
```bash
go run main.go
```
服务器将在 http://localhost:8080 启动

### 构建可执行文件
```bash
go build -o zsh_craft_backend main.go
```

### 运行测试
```bash
go test ./...
```

### 代码格式化
```bash
go fmt ./...
```

### 代码检查
```bash
go vet ./...
```

## 📁 项目结构

```
backend/
├── main.go              # 主服务文件
├── go.mod               # Go 模块文件
├── go.sum               # 依赖校验文件
├── dist/                # 前端构建文件 (自动生成)
└── README.md            # 后端说明文档
```

## 🔧 核心功能

### 1. 静态文件服务
- 使用 `embed` 包嵌入前端构建文件
- 自动服务 `dist` 目录中的静态资源
- 支持 SPA 路由

### 2. API 接口

#### 应用配置接口
```go
POST /api/apply_config
```
- 功能：将配置应用到用户的 `.zshrc` 文件
- 请求体：
  ```json
  {
    "zshrc_content": "生成的 zshrc 内容",
    "zsh_config": "配置的 JSON 字符串"
  }
  ```
- 响应：
  ```json
  {
    "success": true,
    "message": "配置应用成功"
  }
  ```

#### 保存配置接口
```go
POST /api/save_config
```
- 功能：保存配置到 `~/.zsh_cfg/zsh_config.json`
- 请求体：
  ```json
  {
    "config": "配置的 JSON 字符串"
  }
  ```

#### 加载配置接口
```go
GET /api/load_config
```
- 功能：从 `~/.zsh_cfg/zsh_config.json` 加载配置
- 响应：
  ```json
  {
    "success": true,
    "message": "配置加载成功",
    "config": "配置的 JSON 字符串"
  }
  ```

## 🔒 安全特性

### 1. 文件操作安全
- 自动创建备份文件 (`.backup` 后缀)
- 写入失败时自动回滚
- 安全的文件权限设置 (0644)

### 2. 错误处理
- 详细的错误信息返回
- 优雅的错误处理机制
- 用户友好的错误消息

### 3. CORS 支持
- 支持跨域请求
- 预检请求处理
- 安全的 CORS 头设置

## 📂 文件管理

### 创建的文件结构
```
~/
├── .zshrc                    # 生成的 Zsh 配置文件
├── .zsh_cfg/                 # 配置目录
│   ├── zsh_config.json      # 配置文件
│   └── zsh_config.json.backup # 备份文件
```

### 文件操作函数

#### `writeFile(path, content string) error`
- 创建备份文件
- 写入新内容
- 失败时自动回滚

#### `copyFile(src, dst string) error`
- 安全的文件复制
- 错误处理
- 资源清理

## 🌐 HTTP 服务

### 路由配置
```go
// 静态文件服务
http.Handle("/", fs)

// API 路由
http.HandleFunc("/api/apply_config", applyConfigHandler)
http.HandleFunc("/api/save_config", saveConfigHandler)
http.HandleFunc("/api/load_config", loadConfigHandler)
```

### 中间件功能
- CORS 头设置
- 请求方法验证
- 内容类型检查
- 错误响应格式化

## 🔍 调试和日志

### 日志输出
- 服务器启动信息
- 错误日志记录
- 操作状态反馈

### 调试模式
```bash
# 启用详细日志
go run main.go -debug
```

## 🚀 部署

### 开发环境
```bash
go run main.go
```

### 生产环境
```bash
# 构建可执行文件
go build -o zsh_craft_backend main.go

# 运行服务
./zsh_craft_backend
```

### Docker 部署
```dockerfile
FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o zsh_craft_backend main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/zsh_craft_backend .
EXPOSE 8080
CMD ["./zsh_craft_backend"]
```

## 📊 性能优化

### 1. 静态文件优化
- 使用 `embed` 包减少文件 I/O
- 压缩静态资源
- 缓存策略

### 2. 内存管理
- 高效的文件读写
- 及时释放资源
- 避免内存泄漏

### 3. 并发处理
- 支持并发请求
- 线程安全的文件操作
- 合理的错误处理

## 🧪 测试

### 单元测试
```bash
go test -v ./...
```

### 集成测试
```bash
go test -v -tags=integration ./...
```

### 性能测试
```bash
go test -bench=. ./...
```

## 🔧 配置选项

### 环境变量
```bash
# 服务器端口
PORT=8080

# 调试模式
DEBUG=true

# 日志级别
LOG_LEVEL=info
```

### 命令行参数
```bash
# 指定端口
go run main.go -port 8080

# 启用调试
go run main.go -debug

# 指定配置文件
go run main.go -config config.json
```

## 🐛 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 检查端口使用情况
   lsof -i :8080
   
   # 杀死占用进程
   kill -9 <PID>
   ```

2. **权限问题**
   ```bash
   # 检查文件权限
   ls -la ~/.zshrc
   
   # 修复权限
   chmod 644 ~/.zshrc
   ```

3. **文件不存在**
   ```bash
   # 创建必要目录
   mkdir -p ~/.zsh_cfg
   ```

### 日志分析
```bash
# 查看实时日志
tail -f /var/log/zsh_craft.log

# 搜索错误
grep "ERROR" /var/log/zsh_craft.log
```

## 📝 代码规范

- 遵循 Go 官方代码规范
- 使用 `gofmt` 格式化代码
- 添加适当的注释
- 错误处理要完整

## 🤝 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

---

**Zsh Craft Backend** - 高性能的 Zsh 配置管理后端服务 ⚡ 