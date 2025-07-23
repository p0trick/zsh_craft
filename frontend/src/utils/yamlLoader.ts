// @ts-ignore
const yaml = require('js-yaml');

export async function loadYamlFile<T = any>(path: string, options?: any): Promise<T> {
  try {
    // 将src/assets路径转换为public路径
    const publicPath = path.replace('src/assets/', '');
    
    const response = await fetch(publicPath);
    if (!response.ok) {
      throw new Error(`YAML文件加载失败: ${publicPath}, status: ${response.status}`);
    }
    
    const text = await response.text();
    
    const result = yaml.load(text, options) as T;
    
    // 确保返回的是数组
    if (Array.isArray(result)) {
      return result;
    } else {
      console.warn('YAML文件内容不是数组格式，返回空数组');
      return [] as T;
    }
  } catch (error) {
    console.error('加载YAML文件时出错:', error);
    throw error;
  }
} 