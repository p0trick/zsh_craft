# 多阶段构建 Dockerfile
FROM node:18-alpine AS frontend-builder

# 设置工作目录
WORKDIR /app

# 复制前端文件
COPY frontend/package*.json ./

# 安装前端依赖
RUN npm ci --only=production

# 复制前端源代码
COPY frontend/ ./

# 构建前端
RUN npm run build

# Go 构建阶段
FROM golang:1.24-alpine AS backend-builder

# 设置工作目录
WORKDIR /app

# 复制 Go 模块文件
COPY backend/go.mod backend/go.sum ./

# 下载依赖
RUN go mod download

# 复制后端源代码
COPY backend/ ./

# 构建后端
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o zsh_craft .

# 最终运行阶段
FROM alpine:latest

# 安装 ca-certificates 用于 HTTPS
RUN apk --no-cache add ca-certificates

# 创建非 root 用户
RUN addgroup -g 1001 -S zshcraft && \
    adduser -S zshcraft -u 1001

# 设置工作目录
WORKDIR /app

# 从前端构建阶段复制构建文件
COPY --from=frontend-builder /app/build ./dist

# 从后端构建阶段复制可执行文件
COPY --from=backend-builder /app/zsh_craft .

# 创建必要的目录
RUN mkdir -p /home/zshcraft/.zsh_cfg && \
    chown -R zshcraft:zshcraft /app && \
    chown -R zshcraft:zshcraft /home/zshcraft

# 切换到非 root 用户
USER zshcraft

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# 启动命令
CMD ["./zsh_craft"] 