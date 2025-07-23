# 应用zshrc按钮配置说明

## 功能说明

应用zshrc按钮允许用户直接将生成的zshrc配置应用到本地系统，无需手动复制粘贴。

## 环境差异

### 开发环境 (`yarn start`)
- ❌ 不显示应用zshrc按钮
- ✅ 显示导入/导出配置按钮
- ✅ 配置保存到浏览器 localStorage
- ✅ 页面刷新后配置保持

### 生产环境 (`yarn build`)
- ✅ 显示应用zshrc按钮
- ❌ 不显示导入/导出配置按钮
- ✅ 配置自动保存到服务器 (`~/.zsh_cfg/zsh_config.json`)
- ✅ 页面打开时自动加载服务器配置
- ✅ 配置修改时自动保存到服务器

## 配置方法

### 方法一：修改配置文件（推荐）

编辑 `frontend/src/config/appConfig.ts` 文件：

```typescript
export const appConfig = {
  // 是否显示应用zshrc按钮 - 只在生产环境显示
  showApplyButton: process.env.NODE_ENV === 'production',
  
  // 其他配置...
};
```

### 方法二：强制显示/隐藏

如果需要强制控制按钮显示，可以修改为：

```typescript
// 强制显示
showApplyButton: true,

// 强制隐藏
showApplyButton: false,
```

## 按钮位置

应用zshrc按钮会出现在以下两个位置：

1. **顶部工具栏**：在"下载zshrc"按钮旁边
2. **预览弹窗**：在"复制全部"和"下载zshrc"按钮旁边

## 安全提示

⚠️ **重要提醒**：
- 应用zshrc按钮会直接修改用户的 `~/.zshrc` 文件
- 系统会自动创建备份文件（`.zshrc.backup`）
- 建议在应用前先预览配置内容
- 确保后端服务正在运行

## 使用流程

### 开发环境
1. 运行 `yarn start` 启动开发服务器
2. 在应用中配置zsh设置
3. 使用"预览zshrc"功能查看配置
4. 使用"下载zshrc"功能保存配置

### 生产环境
1. 运行 `yarn build` 构建生产版本
2. 启动后端服务
3. 在应用中配置zsh设置
4. 点击"应用zshrc"按钮直接应用配置
5. 确认应用成功

## 故障排除

如果应用失败，请检查：

1. 后端服务是否正在运行
2. API地址是否正确配置
3. 用户是否有写入 `~/.zshrc` 的权限
4. 网络连接是否正常 