#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const basePath = '/Users/xilin/Desktop/langchain-learning-guide/docs';

// 定义所有需要创建的文件及其基础内容模板
const files = [
  // Guide 篇
  { path: 'guide/learning-path.md', title: '学习路径', content: generateLearningPath() },
  { path: 'guide/glossary.md', title: '术语表', content: generateGlossary() },
  { path: 'guide/ecosystem.md', title: '全家桶生态图', content: generateEcosystem() },
  
  // LCEL 篇
  { path: 'lcel/lcel-basics.md', title: 'LCEL 基础与设计哲学', content: generateLcelBasics() },
  { path: 'lcel/runnable-interface.md', title: 'Runnable 接口详解', content: generateRunnableInterface() },
  { path: 'lcel/pipeline.md', title: '管道操作', content: generatePipeline() },
  { path: 'lcel/parallel-branch.md', title: '并行与分支', content: generateParallelBranch() },
  { path: 'lcel/streaming.md', title: '流式处理', content: generateStreaming() },
  { path: 'lcel/error-handling.md', title: '错误处理与重试', content: generateErrorHandling() },
  
  // Model I/O 篇
  { path: 'model-io/chat-models.md', title: 'Chat Models', content: generateChatModels() },
  { path: 'model-io/llms.md', title: 'LLMs', content: generateLlms() },
  { path: 'model-io/prompt-template.md', title: 'Prompt Template', content: generatePromptTemplate() },
  { path: 'model-io/output-parser.md', title: 'Output Parser', content: generateOutputParser() },
  { path: 'model-io/structured-output.md', title: 'Structured Output', content: generateStructuredOutput() },
  { path: 'model-io/tool-calling.md', title: 'Tool Calling', content: generateToolCalling() },
];

// 创建文件的函数
function createFile(filePath, content) {
  const fullPath = path.join(basePath, filePath);
  const dir = path.dirname(fullPath);
  
  // 确保目录存在
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`✓ Created: ${filePath}`);
}

// 生成各个文件的内容
function generateLearningPath() {
  return `---
title: 学习路径
description: LangChain 10 周系统学习计划，从入门到精通的完整路线图
---

# 学习路径：10 周掌握 LangChain 全家桶

## 总体概览

::: v-pre
\`\`\`mermaid
journey
    title 10 周学习路线
    section 第 1 阶段：基础入门
      环境搭建与 Hello World:5:第 1 周
      LCEL 核心语法：5:第 2 周
      Model I/O 组件：5:第 3 周
    section 第 2 阶段：RAG 实战
      文档加载与处理：5:第 4 周
      向量检索系统：5:第 5 周
      RAG 完整 Pipeline:5:第 6 周
    section 第 3 阶段：高级主题
      Agent 与工具调用：5:第 7 周
      LangGraph 工作流：5:第 8 周
      LangSmith 追踪：5:第 9 周
    section 第 4 阶段：项目实战
      综合项目开发：5:第 10 周
      部署与优化：5:第 10 周
\`\`\`
:::

## 详细学习计划

### 第 1 周：环境搭建与 Hello World

**目标**: 完成开发环境配置，运行第一个 LangChain 程序

**学习内容**:
- Python 环境配置
- LangChain 安装与版本管理
- API Key 配置
- Hello World 示例
- LCEL 基础语法

**实践项目**:
1. 创建虚拟环境并安装依赖
2. 配置 OpenAI/DashScope API
3. 编写第一个 Chain
4. 实现流式输出

**时间分配**: 8-10 小时

**产出物**: hello_world.py 示例代码

---

### 第 2 周：LCEL 核心语法

**目标**: 深入理解 LCEL 声明式编排

**学习内容**:
- Runnable 接口详解
- pipe 操作符
- RunnableLambda
- RunnableParallel
- RunnablePassthrough

**实践项目**:
1. 自定义 Runnable 组件
2. 并行分支处理
3. 条件路由实现

**时间分配**: 10-12 小时

**产出物**: LCEL 语法速查表

---

### 第 3 周：Model I/O 组件

**目标**: 掌握 LLM 交互核心组件

**学习内容**:
- Chat Models (OpenAI, Anthropic, 国内模型)
- Prompt Templates
- Output Parsers
- 结构化输出

**实践项目**:
1. 多模型切换
2. 复杂 Prompt 模板
3. JSON/Pydantic 输出解析

**时间分配**: 10-12 小时

**产出物**: Model I/O 组件库

---

### 第 4 周：文档加载与处理

**目标**: 掌握 RAG 数据预处理

**学习内容**:
- Document Loaders (PDF, Web, DB)
- Text Splitters 策略
- Embeddings 模型选型
- 元数据管理

**实践项目**:
1. PDF 文档解析
2. 网页内容爬取
3. 智能文本切分

**时间分配**: 10-12 小时

**产出物**: 文档处理 Pipeline

---

### 第 5 周：向量检索系统

**目标**: 构建向量检索核心能力

**学习内容**:
- 向量数据库选型
- 向量存储与索引
- Retriever 配置
- 混合检索策略

**实践项目**:
1. Chroma/Milvus 部署
2. 向量索引构建
3. 相似度检索

**时间分配**: 12-15 小时

**产出物**: 向量检索服务

---

### 第 6 周：RAG 完整 Pipeline

**目标**: 实现端到端 RAG 系统

**学习内容**:
- RAG 架构设计
- 检索优化策略
- Prompt 工程
- 结果评估

**实践项目**:
1. 完整 RAG 系统
2. 检索效果评估
3. 回答质量优化

**时间分配**: 12-15 小时

**产出物**: 知识库问答系统

---

### 第 7 周：Agent 与工具调用

**目标**: 掌握 Agent 开发能力

**学习内容**:
- Agent 架构原理
- Tool 设计与实现
- Tool Calling
- AgentExecutor

**实践项目**:
1. 自定义 Tool 开发
2. ReAct Agent 实现
3. 多工具协作

**时间分配**: 12-15 小时

**产出物**: 工具调用 Agent

---

### 第 8 周：LangGraph 工作流

**目标**: 掌握复杂工作流编排

**学习内容**:
- StateGraph 基础
- 节点与边定义
- 条件路由
- 人机协同

**实践项目**:
1. 状态图定义
2. 多步骤工作流
3. Human-in-the-Loop

**时间分配**: 15-18 小时

**产出物**: 复杂工作流引擎

---

### 第 9 周：LangSmith 追踪

**目标**: 建立可观测性体系

**学习内容**:
- Tracing 配置
- 评估体系
- Dataset 管理
- Prompt 版本管理

**实践项目**:
1. 接入 LangSmith
2. 创建评估数据集
3. 自动化评估

**时间分配**: 10-12 小时

**产出物**: 可观测性 Dashboard

---

### 第 10 周：项目实战与部署

**目标**: 完成综合项目并部署

**学习内容**:
- 项目整合
- LangServe 部署
- 性能优化
- 生产最佳实践

**实践项目**:
1. 企业知识库 Bot
2. REST API 发布
3. 性能监控

**时间分配**: 15-20 小时

**产出物**: 生产级应用

---

## 学习资源

### 必读书单

| 资源 | 类型 | 难度 |
|-----|------|------|
| 官方文档 | 文档 | ⭐⭐ |
| LangChain Cookbook | 示例 | ⭐⭐ |
| 本学习指南 | 教程 | ⭐⭐⭐ |
| LangChain 源码 | 源码 | ⭐⭐⭐⭐⭐ |

### 视频课程

- LangChain 官方 YouTube 频道
- B 站 LangChain 教程
- Coursera LLM 专项课程

### 实践平台

- Google Colab (免费 GPU)
- Kaggle Notebooks
- 本地 Jupyter

---

## 学习建议

### ✅ 应该做的

1. **每天编码**: 保持手感，至少 30 分钟
2. **做笔记**: 记录关键概念和代码片段
3. **参与社区**: Discord、GitHub Issues
4. **构建项目**: 学完每个模块都做个小项目
5. **教别人**: 写作或分享巩固理解

### ❌ 应该避免的

1. **只看不练**: LLM 开发是实践技能
2. **过早优化**: 先跑起来，再优化
3. **忽视文档**: 官方文档是最好资源
4. **单打独斗**: 遇到问题及时提问

---

## 认证与检验

完成 10 周学习后，你可以通过以下方式检验成果：

### 知识检验

- [ ] 完成所有章节练习题
- [ ] 独立实现 RAG 系统
- [ ] 构建一个多工具 Agent
- [ ] 使用 LangGraph 创建工作流

### 技能检验

| 技能 | 初级 | 中级 | 高级 |
|-----|------|------|------|
| **LCEL** | 理解基本语法 | 灵活组合组件 | 自定义 Runnable |
| **RAG** | 简单检索 | 优化策略 | 生产级系统 |
| **Agent** | 使用内置工具 | 自定义 Tool | 多 Agent 协作 |
| **部署** | 本地运行 | LangServe API | 生产环境 |

---

## 下一步

完成 10 周学习后：

1. 🎓 参与开源项目贡献
2. 📝 撰写技术博客分享
3. 🤝 参与社区讨论
4. 💼 构建个人作品集
5. 🚀 申请 LLM 相关职位

祝你学习顺利！

---

<Badge type="success" text="10 周完成" />
<Badge type="tip" text="实践至上" />
`;
}

function generateGlossary() {
  return `---
title: 术语表
description: LangChain 核心术语速查表，包含中英文对照和简明解释
---

# 术语表

LangChain 核心术语速查手册。

## A

### Agent（智能体）
能够自主规划、使用工具完成复杂任务的 LLM 应用。

### AgentExecutor（智能体执行器）
运行 Agent 的组件，负责循环执行"思考 - 行动 - 观察"过程。

### API（应用程序接口）
不同软件组件之间交互的协议和定义。

### Async（异步）
非阻塞的执行模式，允许在等待 I/O 时执行其他任务。

---

## B

### BasePromptTemplate（基础提示模板）
PromptTemplate 的基类，定义了模板的基本接口。

### Batch（批次处理）
一次性处理多个输入，提高吞吐量。

### Buffer（缓冲区）
Memory 的一种，存储完整的对话历史。

---

## C

### Callback（回调）
在 LLM 应用执行过程中的特定时间点触发的钩子函数。

### Chain（链）
多个组件按顺序组合的执行单元。

### Chat Model（对话模型）
支持多轮对话的 LLM，输入输出都是消息列表。

### Chunk（文本块）
长文档切分后的片段，RAG 的基本处理单元。

### Chroma（向量数据库）
轻量级嵌入式向量数据库，适合开发和测试。

### Context Window（上下文窗口）
LLM 单次处理的最大 token 数量限制。

---

## D

### Document（文档）
LangChain 中的基本数据单元，包含文本和元数据。

### Document Loader（文档加载器）
从各种数据源加载文档的组件。

### DuckDuckGo（搜索引擎）
隐私搜索引擎，常用作 Agent 的搜索工具。

---

## E

### Embedding（嵌入）
将文本转换为向量表示的过程和结果。

### Ensemble Retriever（集成检索器）
组合多个检索器结果的高级检索策略。

### Evaluation（评估）
系统性地衡量 LLM 应用质量的过程。

### Executor（执行器）
运行 Chain 或 Agent 的组件。

---

## F

### FAISS（向量检索库）
Facebook 开源的高效相似度搜索库。

### Few-Shot Learning（少样本学习）
在 Prompt 中提供少量示例指导模型输出。

### Function Calling（函数调用）
LLM 调用外部工具或 API 的能力。

---

## G

### Graph（图）
由节点和边组成的数据结构，LangGraph 的核心。

### GPT（生成式预训练 Transformer）
OpenAI 开发的系列语言模型。

---

## H

### Hallucination（幻觉）
LLM 生成看似合理但实际上错误的信息。

### Human-in-the-Loop（人机协同）
在自动流程中引入人工判断的机制。

### HNSW（分层可导航小世界）
一种高效的近似最近邻搜索算法。

---

## I

### In-Context Learning（上下文学习）
通过 Prompt 中的示例让模型学习新模式。

### Index（索引）
用于加速检索的数据结构。

### Invoke（调用）
执行 Chain 或 Component 的标准方法。

---

## L

### LangChain（语言链）
LLM 应用开发框架。

### LangGraph（语言图）
LangChain 的工作流编排引擎。

### LangSmith（语言智能）
LangChain 的可观测性平台。

### LangServe（语言服务）
LangChain 的部署服务。

### LCEL（LangChain 表达式语言）
LangChain 的声明式编排语言。

### LLM（大语言模型）
基于 Transformer 的大规模语言模型。

### Loader（加载器）
Document Loader 的简称。

---

## M

### Memory（记忆）
在对话中维护历史上下文的机制。

### Metadata（元数据）
描述数据的数据，用于过滤和检索。

### Milvus（向量数据库）
开源分布式向量数据库。

### Model I/O（模型输入输出）
与 LLM 交互的接口层。

### Multi-Agent（多智能体）
多个 Agent 协作完成任务的系统。

---

## N

### Node（节点）
LangGraph 中的基本执行单元。

### Overlap（重叠）
文本切分时相邻块之间的共享部分。

---

## P

### Parser（解析器）
将 LLM 输出转换为结构化数据的组件。

### Pipe（管道）
LCEL 中组合组件的操作符（|）。

### Pinecone（向量云服务）
托管的向量数据库服务。

### Prompt（提示）
发送给 LLM 的输入文本。

### Prompt Template（提示模板）
带有变量的可复用 Prompt 框架。

### Pydantic（数据验证库）
Python 的数据验证和序列化工具。

---

## Q

### Qdrant（向量数据库）
Rust 实现的高性能向量数据库。

### Query（查询）
用户提交的问题或请求。

---

## R

### RAG（检索增强生成）
Retrieval-Augmented Generation 的缩写。

### Retriever（检索器）
根据查询检索相关文档的组件。

### Runnable（可运行）
LangChain 组件的统一接口。

### RecursiveCharacterTextSplitter（递归字符文本分割器）
一种智能的文本切分策略。

### Rerank（重排序）
对检索结果进行二次排序优化。

---

## S

### Sequence（序列）
RunnableSequence 的简称，组件的顺序组合。

### StateGraph（状态图）
LangGraph 中有状态的工作流定义。

### Streaming（流式）
逐步输出结果，无需等待完整响应。

### Structured Output（结构化输出）
使用 Pydantic 模式约束 LLM 输出格式。

---

## T

### Text Splitter（文本分割器）
将长文档切分成小块的工具。

### Token（词元）
LLM 处理文本的基本单位。

### Tool（工具）
Agent 可以调用的外部功能。

### Tracing（追踪）
记录和监控 LLM 调用链的过程。

---

## V

### Vector Database（向量数据库）
专门存储和检索向量数据的数据库。

### Vector Store（向量存储）
存储嵌入向量的组件。

### VitePress（静态站点生成器）
本学习指南使用的文档框架。

---

## W

### Window Memory（窗口记忆）
只保留最近 N 轮对话的记忆策略。

### Workflow（工作流）
一系列有序步骤的组合。

---

## 缩略语对照表

| 缩略语 | 全称 | 中文 |
|-------|------|------|
| AI | Artificial Intelligence | 人工智能 |
| API | Application Programming Interface | 应用程序接口 |
| DL | Deep Learning | 深度学习 |
| Embedding | 嵌入 | 向量表示 |
| LLM | Large Language Model | 大语言模型 |
| ML | Machine Learning | 机器学习 |
| NLP | Natural Language Processing | 自然语言处理 |
| OOP | Object-Oriented Programming | 面向对象编程 |
| RAG | Retrieval-Augmented Generation | 检索增强生成 |
| SDK | Software Development Kit | 软件开发工具包 |
| TF-IDF | Term Frequency-Inverse Document Frequency | 词频 - 逆文档频率 |
| UI | User Interface | 用户界面 |
| UX | User Experience | 用户体验 |
| Vector DB | Vector Database | 向量数据库 |

---

<Badge type="info" text="持续更新" />
`;
}

// ... more generator functions would go here

// 主程序
console.log('Creating documentation files...\n');

files.forEach(file => {
  createFile(file.path, file.content);
});

console.log('\n✅ All files created successfully!');