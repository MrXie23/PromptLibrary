import fs from 'fs';
import path from 'path';

// 常量定义
export const PROMPTS_DIRECTORY = path.join(process.cwd(), 'prompts');

/**
 * 确保目录存在，如果不存在则创建
 * @param directory 目录路径
 * @returns 是否成功确保目录存在
 */
export function ensureDirectoryExists(directory: string): boolean {
  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
      console.log(`创建目录：${directory}`);
    }
    return true;
  } catch (error) {
    console.error(`创建目录失败: ${directory}`, error);
    return false;
  }
}

/**
 * 生成唯一的slug
 * @param title 标题
 * @returns 生成的唯一slug
 */
export function generateUniqueSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
    
  const timestamp = Date.now();
  return `${base}-${timestamp}`;
}

/**
 * 安全的读取文件
 * @param filePath 文件路径
 * @param defaultValue 默认值，如果读取失败
 * @returns 文件内容或默认值
 */
export function safeReadFile(filePath: string, defaultValue: string = ''): string {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    }
    return defaultValue;
  } catch (error) {
    console.error(`读取文件失败: ${filePath}`, error);
    return defaultValue;
  }
}

/**
 * 安全的写入文件
 * @param filePath 文件路径
 * @param content 文件内容
 * @returns 是否成功写入
 */
export function safeWriteFile(filePath: string, content: string): boolean {
  try {
    fs.writeFileSync(filePath, content);
    return true;
  } catch (error) {
    console.error(`写入文件失败: ${filePath}`, error);
    return false;
  }
}

/**
 * 安全的删除文件
 * @param filePath 文件路径
 * @returns 是否成功删除
 */
export function safeDeleteFile(filePath: string): boolean {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return true;
  } catch (error) {
    console.error(`删除文件失败: ${filePath}`, error);
    return false;
  }
}

/**
 * 安全解析JSON
 * @param content JSON字符串
 * @param defaultValue 默认值，如果解析失败
 * @returns 解析后的对象或默认值
 */
export function safeParseJson<T>(content: string, defaultValue: T): T {
  try {
    return JSON.parse(content) as T;
  } catch (error) {
    console.error('解析JSON失败', error);
    return defaultValue;
  }
} 