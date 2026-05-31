---
title: 术语表
description: LangChain 核心术语速查表，包含中英文对照和简明解释
---

# 术语表

LangChain 核心术语速查手册，按字母顺序排列。

## A

### Agent（智能体）
能够自主规划、使用工具完成复杂任务的 LLM 应用。Agent 通过"思考 - 行动 - 观察"循环来解决问题。

### AgentExecutor（智能体执行器）
运行 Agent 的组件，负责循环执行"思考 - 行动 - 观察"过程，直到得出最终答案。

### API（应用程序接口）
不同软件组件之间交互的协议和定义。

### Async（异步）
非阻塞的执行模式，允许在等待 I/O 时执行其他任务。LangChain 所有组件都支持异步调用。

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
在 LLM 应用执行过程中的特定时间点触发的钩子函数，用于监控、调试、日志记录。

### Chain（链）
多个组件按顺序组合的执行单元。在 LCEL 中，Chain 是 RunnableSequence 的同义词。

### Chat Model（对话模型）
支持多轮对话的 LLM，输入输出都是消息列表（Message List）。

### Chunk（文本块）
长文档切分后的片段，RAG 的基本处理单元。

### Chroma（向量数据库）
轻量级嵌入式向量数据库，适合开发和测试。

### Context Window（上下文窗口）
LLM 单次处理的最大 token 数量限制。

---

## D

### Document（文档）
LangChain 中的基本数据单元，包含 `page_content`（文本）和 `metadata`（元数据）。

### Document Loader（文档加载器）
从各种数据源加载文档的组件，支持 PDF、Web、数据库等多种格式。

---

## E

### Embedding（嵌入）
将文本转换为向量表示的过程和结果，用于语义相似度计算。

### Ensemble Retriever（集成检索器）
组合多个检索器（如向量检索 + BM25）结果的高级检索策略。

### Evaluation（评估）
系统性地衡量 LLM 应用质量的过程，包括准确性、相关性、延迟等指标。

---

## F

### FAISS（向量检索库）
Facebook 开源的高效相似度搜索库，支持十亿级向量检索。

### Few-Shot Learning（少样本学习）
在 Prompt 中提供少量示例指导模型输出，提高特定任务表现。

### Function Calling（函数调用）
LLM 调用外部工具或 API 的能力，通过结构化输出来实现。

---

## G

### Graph（图）
由节点和边组成的数据结构，LangGraph 的核心概念。

---

## H

### Hallucination（幻觉）
LLM 生成看似合理但实际上错误或虚构的信息。

### Human-in-the-Loop（人机协同）
在自动流程中引入人工判断的机制，适用于关键决策场景。

### HNSW（分层可导航小世界）
一种高效的近似最近邻搜索算法，向量数据库常用索引。

---

## I

### In-Context Learning（上下文学习）
通过 Prompt 中的示例让模型学习新模式，无需更新模型参数。

### Index（索引）
用于加速检索的数据结构，如向量索引、关键词索引。

### Invoke（调用）
执行 Chain 或 Component 的标准方法，同步执行用 `invoke`，异步用 `ainvoke`。

---

## L

### LangChain（语言链）
用于开发 LLM 应用的开源框架，提供组件化、可组合的开发体验。

### LangChain Expression Language（LCEL）
LangChain 的声明式编排语言，使用 pipe (`|`) 操作符组合组件。

### LangGraph（语言图）
LangChain 的工作流编排引擎，支持状态管理、循环、多智能体协作。

### LangSmith（语言智能）
LangChain 的可观测性平台，提供追踪、评估、测试功能。

### LangServe（语言服务）
LangChain 的部署服务，快速将 Chain 转为 REST API。

### LLM（大语言模型）
基于 Transformer 的大规模语言模型，如 GPT、Claude 等。

### Loader（加载器）
Document Loader 的简称，用于加载文档。

---

## M

### Memory（记忆）
在对话中维护历史上下文的机制，让 LLM 能够"记住"之前的交流。

### Metadata（元数据）
描述数据的数据，用于文档过滤和精确检索。

### Milvus（向量数据库）
开源分布式向量数据库，适合大规模生产场景。

### Model I/O（模型输入输出）
与 LLM 交互的接口层，包括 Chat Models、Prompt Templates、Output Parsers。

### Multi-Agent（多智能体）
多个 Agent 协作完成任务的系统，通过 LangGraph 实现。

---

## N

### Node（节点）
LangGraph 中的基本执行单元，接收状态并返回状态更新。

---

## O

### Overlap（重叠）
文本切分时相邻块之间的共享部分，用于保持上下文完整性。

---

## P

### Parser（解析器）
将 LLM 输出转换为结构化数据的组件，如 JSON、Pydantic 对象。

### Pipe（管道）
LCEL 中组合组件的操作符 (`|`)，将前一个组件的输出连接到后一个的输入。

### Pinecone（向量云服务）
托管的向量数据库服务，免运维。

### Prompt（提示）
发送给 LLM 的输入文本，包含指令、上下文和问题。

### Prompt Template（提示模板）
带有变量的可复用 Prompt 框架，支持动态生成 Prompt。

### Pydantic（数据验证库）
Python 的数据验证和序列化工具，LangChain 用于结构化输出。

---

## Q

### Qdrant（向量数据库）
Rust 实现的高性能向量数据库，过滤能力强。

### Query（查询）
用户提交的问题或请求。

---

## R

### RAG（检索增强生成）
Retrieval-Augmented Generation 的缩写，通过检索外部知识增强 LLM 生成。

### Retriever（检索器）
根据查询检索相关文档的组件，输入是文本，输出是文档列表。

### Runnable（可运行）
LangChain 组件的统一接口，任何实现 Runnable 的对象都可参与 LCEL 组合。

### RecursiveCharacterTextSplitter（递归字符文本分割器）
一种智能的文本切分策略，按字符递归切分，保持语义完整性。

### Rerank（重排序）
对检索结果进行二次排序优化，提高相关性。

---

## S

### Sequence（序列）
RunnableSequence 的简称，组件的顺序组合。

### StateGraph（状态图）
LangGraph 中有状态的工作流定义，包含状态 schema、节点和边。

### Streaming（流式）
逐步输出结果，无需等待完整响应，提升用户体验。

### Structured Output（结构化输出）
使用 Pydantic 模式约束 LLM 输出格式，便于程序处理。

---

## T

### Text Splitter（文本分割器）
将长文档切分成小块的组件，支持多种切分策略。

### Token（词元）
LLM 处理文本的基本单位，中文约 1.5 字/token，英文约 0.75 词/token。

### Tool（工具）
Agent 可以调用的外部功能，通过函数定义。

### Tracing（追踪）
记录和监控 LLM 调用链的过程，用于调试和优化。

---

## V

### Vector Database（向量数据库）
专门存储和检索向量数据的数据库，支持相似度搜索。

### Vector Store（向量存储）
存储嵌入向量的组件，如 Chroma、FAISS、Milvus。

### VitePress（静态站点生成器）
本学习指南使用的文档框架，Vue 驱动。

---

## W

### Window Memory（窗口记忆）
只保留最近 N 轮对话的记忆策略，对话超出窗口时被遗忘。

### Workflow（工作流）
一系列有序步骤的组合，通过 LangGraph 实现。

---

## 缩略语对照表

| 缩略语 | 全称 | 中文 |
|-------|------|------|
| **AI** | Artificial Intelligence | 人工智能 |
| **API** | Application Programming Interface | 应用程序接口 |
| **DL** | Deep Learning | 深度学习 |
| **LLM** | Large Language Model | 大语言模型 |
| **ML** | Machine Learning | 机器学习 |
| **NLP** | Natural Language Processing | 自然语言处理 |
| **RAG** | Retrieval-Augmented Generation | 检索增强生成 |
| **TF-IDF** | Term Frequency-Inverse Document Frequency | 词频 - 逆文档频率 |
| **Vector DB** | Vector Database | 向量数据库 |

---

<Badge type="info" text="持续更新" />