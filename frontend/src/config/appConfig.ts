// 应用配置
export const appConfig = {
  // 是否显示应用zshrc按钮 - 只在生产环境显示
  showApplyButton: process.env.NODE_ENV === 'production',
  
  // 是否显示导入导出按钮 - 只在开发环境显示
  showImportExport: process.env.NODE_ENV !== 'production',
  
  // 是否启用自动保存 - 只在生产环境启用
  autoSave: process.env.NODE_ENV === 'production',
  
  // 其他配置选项
  features: {
    // 是否启用配置预览
    preview: true,
    // 是否启用配置下载
    download: true,
  }
}; 