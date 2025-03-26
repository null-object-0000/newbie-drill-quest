# Newbie Drill Quest

一个专注于技术面试题练习的小程序，帮助开发者更好地准备技术面试。

## 功能特点

- 📚 **题库导入**：支持导入自定义面试题库，覆盖多个技术领域
- 🤖 **AI 点评**：接入 AI，提供专业的答案评估和改进建议
- 📊 **答题评估**：从准确性、完整性、清晰度和逻辑性多个维度进行评分
- 🎯 **智能追问**：基于回答质量，智能生成相关的深度追问
- 📱 **多端适配**：支持 H5、微信小程序等多个平台

## 技术栈

- 前端框架：Vue 3 + TypeScript
- 跨端框架：uni-app
- 构建工具：Vite
- AI 能力：DeepSeek API
- 包管理器：pnpm

## 开发环境

```bash
# 安装依赖
pnpm install

# 启动 H5 开发服务器
pnpm run dev:h5

# 启动微信小程序开发
pnpm run dev:mp-weixin

# 构建 H5 版本
pnpm run build:h5

# 构建微信小程序版本
pnpm run build:mp-weixin
```

## 部署说明

项目使用 GitHub Actions 自动部署 H5 版本到 GitHub Pages：

1. 配置仓库 Secrets：`GH_PAT`（GitHub Personal Access Token）
2. 推送代码到 main 分支会自动触发部署
3. 部署完成后可通过 GitHub Pages 访问 H5 版本

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。在提交 PR 前，请确保：

1. 代码遵循项目的代码规范
2. 新功能或修复有相应的测试用例
3. 所有测试通过
4. 更新相关文档

## 许可证

[MIT](LICENSE)