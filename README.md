# LangChain 全家桶学习指南

📚 从零到一掌握 LangChain 生态全链路，构建生产级 LLM 应用

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![LangChain](https://img.shields.io/badge/LangChain-v0.3+-orange.svg)

## 🎯 项目简介

这是一个系统性的 LangChain 学习指南，基于 VitePress 构建，涵盖：

- **入门篇**: LangChain 生态概览、LCEL 基础、核心概念
- **LCEL 篇**: Runnable 接口、管道操作、流式处理、错误处理
- **Model I/O 篇**: Chat Models、Prompt Templates、Output Parsers
- **RAG 篇**: Document Loaders、Embeddings、Vector Stores、Retrievers
- **Chains 篇**: Chain 基础、迁移到 LCEL
- **Agent 篇**: ReAct Agent、自定义 Tools
- **LangGraph 篇**: StateGraph、Multi-Agent、Human-in-the-Loop
- **Memory 篇**: 对话记忆、向量记忆
- **Callback 篇**: Callback 系统、LangSmith 追踪、Langfuse
- **LangServe 篇**: REST API 部署、流式输出
- **LangSmith 篇**: Tracing、Evaluation、Dataset 管理
- **实战篇**: 企业知识库 Bot、代码助手、多智能体系统
- **面试篇**: 高频面试题、系统设计、手写代码

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run docs:dev
```

访问 http://localhost:5173 查看文档。

### 构建

```bash
npm run docs:build
```

### 预览构建结果

```bash
npm run docs:preview
```

### 部署到 GitHub Pages

```bash
npm run deploy
```

## 📦 项目结构

```
langchain-learning-guide/
├── docs/                    # 文档目录
│   ├── .vitepress/         # VitePress 配置
│   │   ├── config.ts       # 主配置文件
│   │   └── dist/           # 构建输出
│   ├── guide/              # 入门篇
│   ├── lcel/               # LCEL 篇
│   ├── model-io/           # Model I/O 篇
│   ├── rag/                # RAG 篇
│   ├── chains/             # Chains 篇
│   ├── agent/              # Agent 篇
│   ├── langgraph/          # LangGraph 篇
│   ├── memory/             # Memory 篇
│   ├── callbacks/          # Callback 篇
│   ├── langserve/          # LangServe 篇
│   ├── langsmith/          # LangSmith 篇
│   ├── practice/           # 实战篇
│   ├── interview/          # 面试篇
│   └── index.md            # 首页
├── public/                  # 静态资源
│   └── logo.svg            # Logo
├── .github/workflows/       # GitHub Actions
│   └── deploy.yml          # 自动部署
├── package.json            # 项目配置
└── README.md               # 项目说明
```

## 📚 学习内容

### 基础阶段 (第 1-3 周)

- ✅ LangChain 生态概览
- ✅ LCEL 声明式编排
- ✅ Model I/O 组件
- ✅ 快速上手示例

### 进阶阶段 (第 4-6 周)

- ✅ RAG 完整链路
- ✅ Chains 与迁移
- ✅ Agent 开发

### 高级阶段 (第 7-9 周)

- ✅ LangGraph 工作流
- ✅ Multi-Agent 协作
- ✅ LangSmith 可观测性

### 实战阶段 (第 10-12 周)

- ✅ 企业知识库 Bot
- ✅ 代码助手
- ✅ 生产级部署

## 🌟 特色

- 📊 **大量 Mermaid 图表**: 架构图、流程图、时序图
- 💻 **最新 API**: LangChain v0.3+ 代码示例
- 📋 **对比表格**: 多维度技术对比
- 💡 **实用提示**: 最佳实践和注意事项
- 🎯 **实战导向**: 完整项目案例
- 📝 **面试准备**: 高频面试题和解答

## 🛠️ 技术栈

- **VitePress**: 静态站点生成器
- **vitepress-plugin-mermaid**: Mermaid 图表支持
- **LangChain**: LLM 应用开发框架
- **LangGraph**: 工作流编排
- **LangSmith**: 可观测性平台
- **LangServe**: 部署服务

## 📄 License

MIT License - Copyright © 2026 LangChain 全家桶学习指南

## 👥 贡献

欢迎贡献！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📬 联系方式

- GitHub: [@xilin-code](https://github.com/xilin-code)
- 项目地址: https://github.com/xilin-code/langchain-learning-guide

## 🙏 致谢

感谢 LangChain 社区和所有贡献者！

---

**注意**: 本文档仅供学习参考，实际使用时请遵循 LangChain 官方文档和最佳实践。