const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// 提示词目录路径
const promptsDirectory = path.join(process.cwd(), "prompts");
// 输出目录
const outputDirectory = path.join(process.cwd(), "public/data");
// 确保构建输出目录也存在
const buildOutputDirectory = path.join(process.cwd(), "out/PromptLibrary/data");

function generateIndex() {
  // 确保输出目录存在
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  // 确保构建输出目录存在
  if (!fs.existsSync(buildOutputDirectory)) {
    fs.mkdirSync(buildOutputDirectory, { recursive: true });
  }

  const promptFiles = fs
    .readdirSync(promptsDirectory)
    .filter((file) => file.endsWith(".md"));

  const indexData = promptFiles.map((fileName) => {
    // 获取slug (文件名去除扩展名)
    const slug = fileName.replace(/\.md$/, "");

    // 读取文件内容
    const fullPath = path.join(promptsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // 使用gray-matter解析frontmatter
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      category: data.category || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      date: data.date || new Date().toISOString(),
    };
  });

  // 写入索引文件到public目录
  fs.writeFileSync(
    path.join(outputDirectory, "prompts-index.json"),
    JSON.stringify(indexData, null, 2)
  );

  // 同时写入到构建输出目录
  fs.writeFileSync(
    path.join(buildOutputDirectory, "prompts-index.json"),
    JSON.stringify(indexData, null, 2)
  );

  console.log(`索引生成完成，共 ${indexData.length} 个提示词`);
}

generateIndex();
