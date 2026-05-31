# 向量存储

> Vector Store（向量存储）用于高效存储和检索嵌入向量。本章将详细介绍各种向量数据库和选型策略。

## 什么是 Vector Store？

**向量存储**是专门用于存储和检索高维向量的数据库系统。它支持相似度搜索，能够快速找到与查询向量最相似的向量。

::: v-pre
```mermaid
flowchart TB
    Docs[文档] --> Embed[嵌入模型]
    Embed --> Vectors[向量]
    Vectors --> Store[(向量存储)]
    
    Query[查询] --> QueryEmbed[查询嵌入]
    QueryEmbed --> Store
    
    Store --> Search[相似度搜索]
    Search --> Results[相关文档]
    
    style Docs fill:#e1f5ff,stroke:#0066cc
    style Store fill:#fff4e1,stroke:#ff9900
    style Results fill:#e8f5e9,stroke:#388e3c
```
:::

### 核心功能

1. **向量存储**：高效存储高维向量
2. **相似度搜索**：快速找到最近邻
3. **元数据过滤**：支持条件过滤
4. **增删改查**：完整的 CRUD 操作

## FAISS - 本地/开发

**FAISS** (Facebook AI Similarity Search) 是 Meta 开源的向量搜索引擎，适合本地开发和中小型应用。

### 基础用法

```python
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document

# 初始化嵌入
embeddings = OpenAIEmbeddings()

# 创建向量存储
documents = [
    Document(page_content="文档 1 内容", metadata={"id": 1}),
    Document(page_content="文档 2 内容", metadata={"id": 2}),
]

vectorstore = FAISS.from_documents(documents, embeddings)

# 相似度搜索
results = vectorstore.similarity_search("查询内容", k=3)
print(f"找到 {len(results)} 个相关文档")
```

### 添加文档

```python
# 批量添加
vectorstore.add_documents([
    Document(page_content="新文档 1"),
    Document(page_content="新文档 2"),
])

# 添加文本和元数据
texts = ["文本 1", "文本 2", "文本 3"]
metadatas = [{"source": "a"}, {"source": "b"}, {"source": "c"}]
vectorstore.add_texts(texts, metadatas)
```

### 持久化

```python
# 保存到本地
vectorstore.save_local("faiss_index")

# 从本地加载
from langchain_community.vectorstores import FAISS
loaded_store = FAISS.load_local(
    "faiss_index",
    embeddings,
    allow_dangerous_deserialization=True
)
```

### 带过滤的搜索

```python
# 按元数据过滤
results = vectorstore.similarity_search(
    "查询",
    k=5,
    filter={"source": "特定来源"}
)

# 复杂过滤
results = vectorstore.similarity_search(
    "查询",
    k=5,
    filter=lambda metadata: metadata["date"] > "2024-01-01"
)
```

### 高级配置

```python
# 使用 IndexFlatIP（内积相似度）
vectorstore = FAISS(
    embedding_function=embeddings,
    index=faiss.IndexFlatIP(embeddings.embedding_size),
)

# 使用 GPU
import faiss
import numpy as np

# 创建 GPU 索引
res = faiss.StandardGpuResources()
index = faiss.IndexFlatL2(embeddings.embedding_size)
gpu_index = faiss.index_cpu_to_gpu(res, 0, index)

vectorstore = FAISS(embeddings, gpu_index, None, None)
```

## Chroma - 轻量级

**Chroma** 是专为 AI 应用设计的轻量级向量数据库，易于使用。

### 基础用法

```python
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

# 初始化嵌入
embeddings = OpenAIEmbeddings()

# 创建/加载 Chroma
vectorstore = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings,
    collection_name="my_collection"
)

# 添加文档
vectorstore.add_documents([
    Document(page_content="内容", metadata={"id": 1})
])

# 搜索
results = vectorstore.similarity_search("查询", k=3)
```

### 集合管理

```python
# 创建多个集合
collection1 = Chroma(
    collection_name="tech_docs",
    persist_directory="./chroma_db",
    embedding_function=embeddings
)

collection2 = Chroma(
    collection_name="legal_docs",
    persist_directory="./chroma_db",
    embedding_function=embeddings
)

# 删除集合
Chroma.delete_collection("old_collection", "./chroma_db")
```

### 元数据过滤

```python
# 精确匹配
results = vectorstore.similarity_search(
    "查询",
    filter={"category": "技术", "year": 2024}
)

# 条件过滤
results = vectorstore.similarity_search(
    "查询",
    filter={"price": {"$lt": 100}}
)

# $and / $or
filter = {
    "$and": [
        {"category": "技术"},
        {"year": {"$gte": 2023}}
    ]
}
results = vectorstore.similarity_search("查询", filter=filter)
```

## Milvus / Zilliz - 生产级

**Milvus** 是开源的生产级向量数据库，**Zilliz** 是其商业云服务。

### 本地 Milvus

```python
from langchain_community.vectorstores import Milvus
from langchain_openai import OpenAIEmbeddings

# 连接本地 Milvus
vectorstore = Milvus(
    embedding_function=embeddings,
    connection_args={
        "uri": "http://localhost:19530",
    },
    collection_name="my_collection",
    auto_id=True,
)

# 添加文档
vectorstore.add_documents(documents)

# 搜索
results = vectorstore.similarity_search("查询", k=5)
```

### Zilliz Cloud

```python
# 连接 Zilliz Cloud
vectorstore = Milvus(
    embedding_function=embeddings,
    connection_args={
        "uri": "https://in01-xxxxx.aws-us-west-2.vectordb.zillizcloud.com:19530",
        "token": "your_api_key",
    },
    collection_name="production",
)
```

### 索引配置

```python
# 配置索引类型
vectorstore = Milvus(
    embedding_function=embeddings,
    connection_args={"uri": "http://localhost:19530"},
    index_params={
        "metric_type": "IP",  # IP: 内积，L2: 欧氏距离
        "index_type": "IVF_SQ8",  # 索引类型
        "params": {"nlist": 1024},  # 索引参数
    },
)
```

## Pinecone - 托管服务

**Pinecone** 是完全托管的向量数据库服务，无需运维。

### 基础用法

```python
from langchain_pinecone import PineconeVectorDB
from langchain_openai import OpenAIEmbeddings
import pinecone

# 初始化 Pinecone
pinecone.init(
    api_key="your_api_key",
    environment="us-west1-gcp"
)

# 创建或获取索引
index_name = "my-index"

# 检查索引是否存在
if index_name not in pinecone.list_indexes():
    pinecone.create_index(
        name=index_name,
        dimension=1536,
        metric="cosine"
    )

# 连接向量存储
vectorstore = PineconeVectorDB.from_existing_index(
    index_name=index_name,
    embedding=embeddings
)
```

### 批量上传

```python
# 高效批量上传
docs = [...]  # 大量文档

# 分批次添加
batch_size = 100
for i in range(0, len(docs), batch_size):
    batch_docs = docs[i:i+batch_size]
    vectorstore.add_documents(batch_docs)
    print(f"已上传 {min(i+batch_size, len(docs))}/{len(docs)}")
```

## PGVector - PostgreSQL 扩展

**PGVector** 是 PostgreSQL 的向量扩展，可以利用现有 PG 基础设施。

### 基础配置

```python
from langchain_community.vectorstores import PGVector
from langchain_openai import OpenAIEmbeddings

CONNECTION_STRING = "postgresql+psycopg://user:pass@localhost:5432/dbname"

# 创建向量存储
vectorstore = PGVector(
    embedding_function=embeddings,
    collection_name="documents",
    connection_string=CONNECTION_STRING,
)

# 添加文档
vectorstore.add_documents(documents)

# 搜索
results = vectorstore.similarity_search("查询", k=5)
```

### 元数据过滤

```python
# PGVector 支持强大的 SQL 过滤
results = vectorstore.similarity_search(
    "查询",
    k=5,
    filter={"category": "tech", "status": "published"}
)
```

## Qdrant - 高性能

**Qdrant** 是 Rust 编写的高性能向量数据库，支持本地和云服务。

### 本地 Qdrant

```python
from langchain_community.vectorstores import Qdrant
from langchain_openai import OpenAIEmbeddings

# 本地存储
vectorstore = Qdrant.from_documents(
    documents=documents,
    embedding=embeddings,
    path="./qdrant_db",
    collection_name="my_collection"
)

# 搜索
results = vectorstore.similarity_search("查询", k=5)
```

### Qdrant Cloud

```python
# 连接 Qdrant Cloud
vectorstore = Qdrant.from_documents(
    documents=documents,
    embedding=embeddings,
    url="https://xxx-xxx.aws.cloud.qdrant.io",
    api_key="your_api_key",
    collection_name="production"
)
```

## 选型决策树

::: v-pre
```mermaid
flowchart TD
    Start[选择向量存储] --> Scale{数据规模？}
    
    Scale -->|小型 <10 万 | Local[本地方案]
    Scale -->|中型 10 万 -1000 万 | Mid[中型方案]
    Scale -->|大型 >1000 万 | Enterprise[企业方案]
    
    Local --> Deploy{部署偏好？}
    Deploy -->|简单 | Chroma[Chroma]
    Deploy -->|已有 PG | PGVector[PGVector]
    Deploy -->|性能 | FAISS[FAISS]
    
    Mid --> Req{需求？}
    Req -->|开源 | Milvus[Milvus]
    Req -->|托管 | Pinecone[Pinecone]
    Req -->|高性能 | Qdrant[Qdrant]
    
    Enterprise --> Cloud{云服务？}
    Cloud -->|是 | Zilliz[Zilliz Cloud]
    Cloud -->|自部署 | Milvus[Milvus 集群]
    
    style Start fill:#e1f5ff,stroke:#0066cc
    style Chroma fill:#e8f5e9,stroke:#388e3c
    style FAISS fill:#e8f5e9,stroke:#388e3c
    style Zilliz fill:#fff4e1,stroke:#ff9900
```
:::

### 详细对比表

| 向量库 | 类型 | 规模 | 运维 | 成本 | 适合场景 |
|--------|------|------|------|------|----------|
| **FAISS** | 库 | 小型 | 无 | 免费 | 开发/本地 |
| **Chroma** | 嵌入式 | 中小型 | 低 | 免费 | 原型/小规模 |
| **Milvus** | 数据库 | 中大型 | 中 | 免费 | 生产环境 |
| **Zilliz** | 云服务 | 大型 | 无 | 付费 | 企业应用 |
| **Pinecone** | 云服务 | 中大型 | 无 | 付费 | 快速上线 |
| **PGVector** | 扩展 | 中小型 | 中 | 免费 | 已有 PG |
| **Qdrant** | 数据库 | 中大型 | 中 | 免费 | 高性能 |

## 向量数据库生态图

::: v-pre
```mermaid
flowchart TB
    subgraph Local [本地/嵌入式]
        FAISS[FAISS<br/>Meta 开源]
        Chroma[Chroma<br/>AI Native]
        QdrantLocal[Qdrant<br/>Rust 编写]
    end
    
    subgraph SelfHost [自托管]
        Milvus[Milvus<br/>云原生]
        PGVector[PGVector<br/>PG 扩展]
    end
    
    subgraph Cloud [云服务]
        Pinecone[Pinecone<br/>全托管]
        Zilliz[Zilliz<br/>Milvus 云端]
        QdrantCloud[Qdrant Cloud]
    end
    
    Local --> SelfHost
    SelfHost --> Cloud
    
    style Local fill:#e3f2fd,stroke:#1976d2
    style SelfHost fill:#fff3e0,stroke:#f57c00
    style Cloud fill:#e8f5e9,stroke:#388e3c
```
:::

## 实战配置

### 配置 1: 快速原型

```python
# 使用 Chroma 快速开始
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

vectorstore = Chroma.from_documents(
    documents=documents,
    embedding=OpenAIEmbeddings(),
    persist_directory="./chroma_db"
)
```

### 配置 2: 生产环境

```python
# 使用 Milvus 生产部署
from langchain_community.vectorstores import Milvus

vectorstore = Milvus(
    embedding_function=embeddings,
    connection_args={
        "uri": "http://milvus-cluster:19530",
    },
    collection_name="production_docs",
    index_params={
        "metric_type": "IP",
        "index_type": "IVF_PQ",
        "params": {"nlist": 2048, "m": 16}
    },
    search_params={"params": {"nprobe": 32}}
)
```

### 配置 3: 托管服务

```python
# 使用 Pinecone 免运维
from langchain_pinecone import PineconeVectorDB

vectorstore = PineconeVectorDB.from_existing_index(
    index_name="prod-index",
    embedding=embeddings,
    text_key="text",
    namespace="production"
)
```

### 配置 4: 利用现有 PG

```python
# 使用 PGVector
from langchain_community.vectorstores import PGVector

vectorstore = PGVector(
    embedding_function=embeddings,
    collection_name="docs",
    connection_string="postgresql+psycopg://user:pass@db:5432/app",
    pre_delete_collection=False,
)
```

## 性能优化

### 1. 批量操作

```python
# 批量添加文档
def batch_add(vectorstore, documents, batch_size=100):
    for i in range(0, len(documents), batch_size):
        batch = documents[i:i+batch_size]
        vectorstore.add_documents(batch)
        print(f"已添加 {i+len(batch)}/{len(documents)}")
```

### 2. 索引优化

```python
# FAISS 索引优化
import faiss

# 创建一个更高效的索引
index = faiss.IndexHNSWFlat(
    embeddings.embedding_size,
    64,  # M 参数
    faiss.METRIC_INNER_PRODUCT
)

vectorstore = FAISS(embeddings, index, None, None)
```

### 3. 缓存

```python
# 缓存搜索结果
from functools import lru_cache

class CachedVectorStore:
    def __init__(self, vectorstore):
        self.vectorstore = vectorstore
        self.cache = {}
    
    def similarity_search(self, query, k=5):
        cache_key = f"{query}:{k}"
        if cache_key not in self.cache:
            self.cache[cache_key] = self.vectorstore.similarity_search(query, k)
        return self.cache[cache_key]
```

## 常见问题

### Q1: 什么时候需要向量存储？

**A**: 
- 简单的 demo：可以直接用列表存储向量
- 需要持久化：使用 Chroma 或 FAISS
- 生产环境：考虑 Milvus、Pinecone

### Q2: 如何选择索引类型？

**A**:
- 精确搜索：IndexFlatL2、IndexFlatIP
- 大规模近似搜索：IVF、HNSW、PQ

### Q3: 向量数据库和数据湖的区别？

**A**: 向量数据库专用于高维向量的相似度搜索，而数据湖存储原始数据。

## 本章小结

本章介绍了各种向量存储方案：

1. **FAISS**：本地开发首选
2. **Chroma**：轻量级 AI 原生
3. **Milvus/Zilliz**：生产级方案
4. **Pinecone**：托管服务
5. **PGVector**：利用现有 PG
6. **Qdrant**：高性能 Rust 实现
7. **选型指南**：根据场景选择合适方案

下一章我们将学习 **检索器**，了解各种检索策略。

## 继续学习

- [检索器](./retrievers.md) - 检索策略详解
- [嵌入模型](./embeddings.md) - 嵌入回顾
- [多向量检索](./multi-vector-retriever.md) - 高级检索
- [RAG 最佳实践](./rag-best-practices.md) - 完整指南