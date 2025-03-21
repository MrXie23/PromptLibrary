/**
 * 批量更新JSON文件脚本
 *
 * 此脚本会移除所有JSON文件中的views、likes、usageCount、favoriteCount和slug字段
 */

const fs = require("fs");
const path = require("path");

// 提示文件目录
const PROMPTS_DIRECTORY = path.join(process.cwd(), "prompts");

// 获取所有JSON文件
function getAllJsonFiles() {
  const files = fs.readdirSync(PROMPTS_DIRECTORY);
  return files.filter((file) => file.endsWith(".json"));
}

// 更新单个JSON文件
function updateJsonFile(filename) {
  const filePath = path.join(PROMPTS_DIRECTORY, filename);
  try {
    // 读取文件内容
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // 移除不需要的字段
    const { views, likes, usageCount, favoriteCount, slug, ...rest } = data;

    // 保存更新后的文件
    fs.writeFileSync(filePath, JSON.stringify(rest, null, 2), "utf8");
    console.log(`已更新: ${filename}`);
    return true;
  } catch (error) {
    console.error(`更新 ${filename} 失败:`, error);
    return false;
  }
}

// 主函数
function main() {
  console.log("开始批量更新JSON文件...");

  const jsonFiles = getAllJsonFiles();
  console.log(`找到 ${jsonFiles.length} 个JSON文件`);

  let successCount = 0;
  let failCount = 0;

  jsonFiles.forEach((file) => {
    const success = updateJsonFile(file);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  });

  console.log("\n更新完成:");
  console.log(`成功: ${successCount} 个文件`);
  console.log(`失败: ${failCount} 个文件`);
}

// 执行主函数
main();
