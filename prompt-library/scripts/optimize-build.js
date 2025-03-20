const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

console.log("开始优化生产构建...");

// 输出目录
const outDir = path.join(process.cwd(), "out");

// 遍历所有HTML，JS和CSS文件
function optimizeFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      optimizeFiles(fullPath);
      continue;
    }

    // 处理HTML, JS和CSS文件
    if (/\.(html|js|css)$/.test(file.name)) {
      console.log(`优化文件: ${fullPath}`);
      let content = fs.readFileSync(fullPath, "utf8");

      // 压缩HTML
      if (file.name.endsWith(".html")) {
        // 简单的HTML最小化（移除注释和多余空白）
        content = content
          .replace(/<!--(?!<!)[^\[>][\s\S]*?-->/g, "") // 移除注释
          .replace(/\s{2,}/g, " ") // 减少多个空白为一个
          .replace(/>\s+</g, "><"); // 移除标签之间的空白
      }

      // 写回优化后的文件
      fs.writeFileSync(fullPath, content, "utf8");

      // 创建gzip版本，GitHub Pages会自动使用这些文件（如果存在）
      const gzipped = zlib.gzipSync(content);
      fs.writeFileSync(`${fullPath}.gz`, gzipped);
    }
  }
}

// 检查输出目录是否存在
if (fs.existsSync(outDir)) {
  // 开始优化
  optimizeFiles(outDir);
  console.log("优化完成！");
} else {
  console.error("错误: 输出目录不存在。请先运行 npm run build");
}
