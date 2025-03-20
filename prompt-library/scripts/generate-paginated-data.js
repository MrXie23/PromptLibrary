const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// 配置项
const ITEMS_PER_PAGE = 9; // 每页显示的提示词数量（根据您的要求设置为9）
const CATEGORIES_ITEMS_PER_PAGE = 9; // 分类页面每页显示数量

// 提示词目录路径
const promptsDirectory = path.join(process.cwd(), "prompts");
// 输出目录
const outputDirectory = path.join(process.cwd(), "public/data");
// 确保构建输出目录也存在
const buildOutputDirectory = path.join(process.cwd(), "out/PromptLibrary/data");

/**
 * 获取所有提示词数据
 */
function getAllPrompts() {
  // 确保目录存在
  if (!fs.existsSync(promptsDirectory)) {
    return [];
  }

  // 获取所有markdown文件
  const filenames = fs.readdirSync(promptsDirectory);
  const mdFiles = filenames.filter((filename) => filename.endsWith(".md"));

  const allPromptsData = mdFiles.map((filename) => {
    // 移除 ".md" 获取 slug
    const slug = filename.replace(/\.md$/, "");

    // 读取markdown文件
    const fullPath = path.join(promptsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // 使用gray-matter解析frontmatter
    const matterResult = matter(fileContents);

    // 尝试读取对应的JSON文件以获取更多元数据
    const jsonFilePath = path.join(promptsDirectory, `${slug}.json`);
    let jsonData = {};

    if (fs.existsSync(jsonFilePath)) {
      try {
        const jsonContent = fs.readFileSync(jsonFilePath, "utf8");
        jsonData = JSON.parse(jsonContent);
      } catch (error) {
        console.error(`Error parsing JSON for ${slug}:`, error);
      }
    }

    // 合并frontmatter和JSON数据
    return {
      slug,
      ...matterResult.data,
      ...jsonData,
    };
  });

  // 按创建日期排序，最新的排在前面
  return allPromptsData.sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });
}

/**
 * 创建必要的输出目录
 */
function createOutputDirectories() {
  // 主要输出目录
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  // 分页数据子目录
  const paginatedDir = path.join(outputDirectory, "paginated");
  if (!fs.existsSync(paginatedDir)) {
    fs.mkdirSync(paginatedDir, { recursive: true });
  }

  // 构建输出目录
  if (!fs.existsSync(buildOutputDirectory)) {
    fs.mkdirSync(buildOutputDirectory, { recursive: true });
  }

  // 构建分页数据子目录
  const buildPaginatedDir = path.join(buildOutputDirectory, "paginated");
  if (!fs.existsSync(buildPaginatedDir)) {
    fs.mkdirSync(buildPaginatedDir, { recursive: true });
  }

  return { paginatedDir, buildPaginatedDir };
}

/**
 * 生成所有提示词的分页数据
 */
function generateAllPromptsPages(allPrompts, paginatedDir, buildPaginatedDir) {
  const totalPages = Math.ceil(allPrompts.length / ITEMS_PER_PAGE);

  console.log(`生成所有提示词分页数据，共 ${totalPages} 页`);

  // 生成分页元数据
  const paginationMeta = {
    total: allPrompts.length,
    perPage: ITEMS_PER_PAGE,
    totalPages,
  };

  // 写入分页元数据
  fs.writeFileSync(
    path.join(paginatedDir, "all-prompts-meta.json"),
    JSON.stringify(paginationMeta, null, 2)
  );
  fs.writeFileSync(
    path.join(buildPaginatedDir, "all-prompts-meta.json"),
    JSON.stringify(paginationMeta, null, 2)
  );

  // 生成每一页的数据
  for (let page = 1; page <= totalPages; page++) {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageData = allPrompts.slice(startIndex, endIndex);

    fs.writeFileSync(
      path.join(paginatedDir, `all-prompts-page-${page}.json`),
      JSON.stringify(pageData, null, 2)
    );
    fs.writeFileSync(
      path.join(buildPaginatedDir, `all-prompts-page-${page}.json`),
      JSON.stringify(pageData, null, 2)
    );
  }
}

/**
 * 生成分类提示词的分页数据
 */
function generateCategoryPages(allPrompts, paginatedDir, buildPaginatedDir) {
  // 获取所有分类及其提示词
  const categories = {};

  allPrompts.forEach((prompt) => {
    const category = prompt.category;
    if (category) {
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(prompt);
    }
  });

  // 为每个分类生成分页数据
  Object.entries(categories).forEach(([categoryName, categoryPrompts]) => {
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, "-");
    const totalPages = Math.ceil(
      categoryPrompts.length / CATEGORIES_ITEMS_PER_PAGE
    );

    console.log(`生成分类 "${categoryName}" 分页数据，共 ${totalPages} 页`);

    // 生成分页元数据
    const paginationMeta = {
      category: categoryName,
      total: categoryPrompts.length,
      perPage: CATEGORIES_ITEMS_PER_PAGE,
      totalPages,
    };

    // 创建分类目录
    const categoryDir = path.join(paginatedDir, "categories", categorySlug);
    const buildCategoryDir = path.join(
      buildPaginatedDir,
      "categories",
      categorySlug
    );

    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
    if (!fs.existsSync(buildCategoryDir)) {
      fs.mkdirSync(buildCategoryDir, { recursive: true });
    }

    // 写入分页元数据
    fs.writeFileSync(
      path.join(categoryDir, "meta.json"),
      JSON.stringify(paginationMeta, null, 2)
    );
    fs.writeFileSync(
      path.join(buildCategoryDir, "meta.json"),
      JSON.stringify(paginationMeta, null, 2)
    );

    // 生成每一页的数据
    for (let page = 1; page <= totalPages; page++) {
      const startIndex = (page - 1) * CATEGORIES_ITEMS_PER_PAGE;
      const endIndex = startIndex + CATEGORIES_ITEMS_PER_PAGE;
      const pageData = categoryPrompts.slice(startIndex, endIndex);

      fs.writeFileSync(
        path.join(categoryDir, `page-${page}.json`),
        JSON.stringify(pageData, null, 2)
      );
      fs.writeFileSync(
        path.join(buildCategoryDir, `page-${page}.json`),
        JSON.stringify(pageData, null, 2)
      );
    }
  });
}

/**
 * 主函数：生成所有分页数据
 */
function generatePaginatedData() {
  console.log("开始生成分页数据...");

  // 获取所有提示词
  const allPrompts = getAllPrompts();
  console.log(`共读取 ${allPrompts.length} 个提示词`);

  // 创建输出目录
  const { paginatedDir, buildPaginatedDir } = createOutputDirectories();

  // 生成所有提示词的分页数据
  generateAllPromptsPages(allPrompts, paginatedDir, buildPaginatedDir);

  // 生成分类提示词的分页数据
  generateCategoryPages(allPrompts, paginatedDir, buildPaginatedDir);

  console.log("分页数据生成完成！");
}

// 执行生成过程
generatePaginatedData();
