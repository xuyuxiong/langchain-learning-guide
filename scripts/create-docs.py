#!/usr/bin/env python3
"""批量创建 LangChain 学习指南文档文件"""

import os

base_path = '/Users/xilin/Desktop/langchain-learning-guide/docs'

# 定义所有文件
files = {
    'guide/glossary.md': '术语表',
    'guide/ecosystem.md': '全家桶生态图',
    'lcel/lcel-basics.md': 'LCEL 基础与设计哲学',
    'lcel/runnable-interface.md': 'Runnable 接口详解',
    'lcel/pipeline.md': '管道操作',
    'lcel/parallel-branch.md': '并行与分支',
    'lcel/streaming.md': '流式处理',
    'lcel/error-handling.md': '错误处理与重试',
    'model-io/chat-models.md': 'Chat Models',
    'model-io/llms.md': 'LLMs',
    'model-io/prompt-template.md': 'Prompt Template',
    'model-io/output-parser.md': 'Output Parser',
    'model-io/structured-output.md': 'Structured Output',
    'model-io/tool-calling.md': 'Tool Calling',
    'rag/document-loaders.md': 'Document Loaders',
    'rag/text-splitters.md': 'Text Splitters',
    'rag/embeddings.md': 'Embeddings',
    'rag/vector-stores.md': 'Vector Stores',
    'rag/retrievers.md': 'Retrievers',
    'rag/multi-vector-retriever.md': 'MultiVector Retriever',
    'rag/parent-doc-retriever.md': 'Parent Document Retriever',
    'rag/rag-best-practices.md': 'RAG 最佳实践',
    'chains/chain-basics.md': 'Chain 基础与演进',
    'chains/sequential-chains.md': 'Sequential Chains',
    'chains/router-chain.md': 'Router Chain',
    'chains/migrate-to-lcel.md': '从 Legacy Chain 迁移到 LCEL',
    'agent/agent-overview.md': 'Agent 概念与架构',
    'agent/react-agent.md': 'ReAct Agent 实战',
    'agent/tools-toolkit.md': '内置 Tools 与 Toolkit',
    'agent/custom-tools.md': '自定义 Tool 开发',
    'agent/agent-executor.md': 'AgentExecutor 深入',
    'agent/lcel-agent.md': 'LCEL 风格的 Agent',
    'langgraph/langgraph-basics.md': 'LangGraph 基础',
    'langgraph/state-graph.md': 'StateGraph 与状态定义',
    'langgraph/nodes-edges.md': '节点与边的定义',
    'langgraph/conditional-routing.md': '条件路由与分支',
    'langgraph/human-in-loop.md': '人机协同',
    'langgraph/multi-agent.md': 'Multi-Agent 协作',
    'langgraph/persistence.md': '持久化与检查点',
    'langgraph/subgraphs.md': '子图与组合',
    'memory/conversation-memory.md': '对话记忆基础',
    'memory/window-memory.md': '窗口记忆',
    'memory/summary-memory.md': '摘要记忆',
    'memory/vector-memory.md': '向量记忆',
    'memory/migrate-memory-lcel.md': 'Memory 迁移到 LCEL',
    'callbacks/callback-system.md': 'Callback 系统架构',
    'callbacks/custom-handler.md': '自定义 Callback Handler',
    'callbacks/langsmith-tracing.md': 'LangSmith 追踪集成',
    'callbacks/langfuse.md': 'Langfuse 可观测性',
    'langserve/quick-deploy.md': '快速部署 REST API',
    'langserve/api-design.md': 'API 设计与最佳实践',
    'langserve/streaming-output.md': '流式输出',
    'langserve/auth-rate-limit.md': '认证、限流与生产部署',
    'langsmith/langsmith-overview.md': 'LangSmith 概览',
    'langsmith/tracing.md': 'Tracing 追踪详解',
    'langsmith/evaluation.md': '评估体系',
    'langsmith/dataset.md': 'Dataset 与测试集管理',
    'langsmith/prompt-management.md': 'Prompt 版本管理',
    'practice/project-qa-bot.md': '企业知识库问答 Bot',
    'practice/project-code-assistant.md': '代码助手',
    'practice/project-multi-agent-system.md': '多智能体协作系统',
    'practice/project-rag-pipeline.md': '生产级 RAG Pipeline',
    'practice/project-summary.md': '总结：从概念到产品',
    'interview/langchain-questions.md': 'LangChain 高频面试题',
    'interview/system-design.md': '系统设计题',
    'interview/coding-questions.md': '手写代码题',
    'interview/comparison.md': '对比辨析题',
}

# 创建文件
print('创建文档文件...\n')

for file_path, title in files.items():
    full_path = os.path.join(base_path, file_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    
    content = f'''---
title: {title}
description: {title}详细说明与实践指南
---

# {title}

::: v-pre
```mermaid
flowchart TD
    Start[开始] --> Process[处理]
    Process --> Result[结果]
    
    style Start fill:#e3f2fd
    style Result fill:#e8f5e9
```
:::

## 概述

本文档详细介绍 {title}。

## 核心概念

### 基本概念

{title}是 LangChain 生态中的重要组成部分。

## 使用示例

```python
from langchain_core.runnables import RunnableLambda

# 示例代码
def example_func(x):
    return f"处理：{{x}}"

chain = RunnableLambda(example_func)
result = chain.invoke("测试输入")
print(result)
```

## 最佳实践

1. **理解原理**: 深入理解底层机制
2. **从小开始**: 先构建简单示例
3. **逐步优化**: 迭代改进性能
4. **参考文档**: 查阅官方文档

## 常见问题

### Q1: 常见问题？

A: 常见解答。

### Q2: 另一个问题？

A: 另一解答。

## 下一步

- 继续阅读相关文档
- 实践代码示例
- 参与社区讨论

---

<Badge type="info" text="持续更新" />
'''
    
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'✓ {file_path}')

print(f'\n✅ 成功创建 {len(files)} 个文件!')