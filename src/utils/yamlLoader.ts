// @ts-ignore
const yaml = require('js-yaml');

export async function loadYamlFile<T = any>(path: string, options?: any): Promise<T> {
  // 将src/assets路径转换为public路径
  const publicPath = path.replace('src/assets/', '');
  const response = await fetch(publicPath);
  if (!response.ok) throw new Error('YAML文件加载失败: ' + publicPath);
  const text = await response.text();
  return yaml.load(text, options) as T;
} 