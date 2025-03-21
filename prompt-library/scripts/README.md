# 提示库脚本

此目录包含用于维护提示库的各种实用脚本。

## update-json-files.js

这个脚本用于批量更新所有 JSON 文件，移除不需要的字段（views, likes, usageCount, favoriteCount, slug）。

### 使用方法

在终端中运行以下命令：

```bash
# 首先确保你在prompt-library目录下
cd prompt-library

# 运行脚本
node scripts/update-json-files.js
```

### 功能说明

此脚本会：

1. 扫描`prompts`目录下所有的 JSON 文件
2. 从每个文件中移除`views`、`likes`、`usageCount`、`favoriteCount`和`slug`字段
3. 保留其他字段（如`featured`、`createdAt`、`updatedAt`和`rating`）
4. 保存更新后的文件

### 注意事项

- 脚本会直接修改原始文件，建议在运行前备份重要数据
- 脚本运行完成后会显示处理成功和失败的文件数量
