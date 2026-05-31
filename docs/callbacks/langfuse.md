# Langfuse：开源可观测性

Langfuse 是一个开源的 LLM 可观测性平台，提供追踪、分析、评估等功能。与 LangSmith 相比，Langfuse 支持自托管，数据完全可控。

## 为什么选择 Langfuse？

### 与 LangSmith 对比

| 特性 | LangSmith | Langfuse |
|------|-----------|----------|
| **开源** | 否 | ✅ 是 |
| **自托管** | 否 | ✅ 是 |
| **数据位置** | LangChain 服务器 | 你自己控制 |
| **定价** | 免费 + 付费 tiers | 开源免费 + 云服务 |
| **集成难度** | 简单 | 简单 |
| **功能完整度** | 高 | 高 |
| **社区支持** | 官方 | 活跃开源社区 |

### Langfuse 优势

- 🔓 **开源**：代码透明，可自定义
- 🏠 **自托管**：数据隐私 guaranteed
- 💰 **成本**：自托管无额外费用
- 🔧 **灵活**：可扩展和定制
- 🌍 **多云**：可部署在任何云

## 集成方式

### 安装

```bash
pip install langfuse langchain-langfuse
```

### 基础配置

```python
import os
from langfuse import Langfuse

# 配置环境变量
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..."
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..."
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com"  # 或自托管地址

# 初始化
langfuse = Langfuse()

# 创建 trace
trace = langfuse.trace(
    name="qa-pipeline",
    user_id="user_123",
    session_id="session_456",
    metadata={"environment": "production"}
)

# 创建 span（表示一个处理步骤）
generation = trace.generation(
    name="llm-call",
    model="gpt-4o",
    input="你好，请自我介绍",
    model_parameters={"temperature": 0.7}
)

# 执行 LLM 调用
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model="gpt-4o")
response = llm.invoke("你好，请自我介绍")

# 更新 generation 结果
generation.end(
    output=response.content,
    usage={
        "promptTokens": response.response_metadata.get("prompt_tokens", 0),
        "completionTokens": response.response_metadata.get("completion_tokens", 0),
        "totalTokens": response.response_metadata.get("total_tokens", 0)
    }
)

# 完成 trace
trace.end()
```

### 与 LangChain 集成

```python
from langfuse.langchain import CallbackHandler

# 创建 Langfuse handler
langfuse_handler = CallbackHandler(
    public_key="pk-lf-...",
    secret_key="sk-lf-...",
    host="https://cloud.langfuse.com"
)

# 在 LangChain 中使用
from langchain.chains import ConversationChain
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o")
chain = ConversationChain(llm=llm)

# 自动追踪
response = chain.invoke(
    {"input": "你好"},
    config={"callbacks": [langfuse_handler]}
)

# 等待 flush 确保数据发送
langfuse_handler.flush()
```

### 异步支持

```python
import asyncio
from langfuse.langchain import AsyncCallbackHandler

# 异步 handler
async_handler = AsyncCallbackHandler(
    public_key="pk-lf-...",
    secret_key="sk-lf-..."
)

async def main():
    response = await chain.ainvoke(
        {"input": "你好"},
        config={"callbacks": [async_handler]}
    )
    await async_handler.flush()

asyncio.run(main())
```

## 与 LangSmith 的对比

### 功能对比表

| 功能 | LangSmith | Langfuse |
|------|-----------|----------|
| 自动追踪 | ✅ | ✅ |
| 可视化界面 | ✅ | ✅ |
| 成本分析 | ✅ | ✅ |
| 延迟分析 | ✅ | ✅ |
| 用户反馈 | ✅ | ✅ |
| 评估框架 | ✅ | ✅ |
| Prompt 管理 | ✅ | ✅ |
| 自托管 | ❌ | ✅ |
| 开源 | ❌ | ✅ |
| 数据导出 | 有限 | ✅ 完整 |
| 自定义指标 | 有限 | ✅ 灵活 |

### 代码对比

**LangSmith:**
```python
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "..."

# 自动追踪，无需额外代码
response = chain.invoke({"input": "你好"})
```

**Langfuse:**
```python
from langfuse.langchain import CallbackHandler

handler = CallbackHandler(
    public_key="...",
    secret_key="..."
)

response = chain.invoke(
    {"input": "你好"},
    config={"callbacks": [handler]}
)
handler.flush()
```

## 自托管部署

### Docker 部署

```bash
# 使用 Docker Compose
git clone https://github.com/langfuse/langfuse.git
cd langfuse/docker-compose

# 配置环境变量
cp .env.example .env
# 编辑 .env 设置密码和配置

# 启动服务
docker-compose up -d

# 访问 http://localhost:3000
```

### 环境变量配置

```bash
# .env 文件示例
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/postgres
SALT=your-salt
ENCRYPTION_KEY=your-encryption-key
```

### Kubernetes 部署

```yaml
# langfuse-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: langfuse
spec:
  replicas: 2
  selector:
    matchLabels:
      app: langfuse
  template:
    metadata:
      labels:
        app: langfuse
    spec:
      containers:
      - name: langfuse
        image: langfuse/langfuse:latest
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: langfuse-secrets
              key: database-url
        - name: NEXTAUTH_SECRET
          valueFrom:
            secretKeyRef:
              name: langfuse-secrets
              key: nextauth-secret
        ports:
        - containerPort: 3000
```

### 生产部署建议

```bash
# 1. 使用托管 PostgreSQL
# AWS RDS, GCP Cloud SQL, Azure Database

# 2. 配置 HTTPS
# 使用 Nginx 或云服务负载均衡器

# 3. 设置备份策略
pg_dump -h db-host -U postgres langfuse > backup.sql

# 4. 监控和告警
# Prometheus + Grafana 监控 Langfuse 指标

# 5. 水平扩展
# 多副本部署，共享数据库
```

## Langfuse 架构图

::: v-pre
```mermaid
graph TB
    subgraph 应用层
        A[LLM 应用] -->|发送追踪 | B[Langfuse SDK]
    end
    
    subgraph SDK 层
        B --> C[批处理队列]
        C --> D[异步上传]
        D --> E[错误重试]
    end
    
    subgraph Langfuse 服务
        E --> F[API 服务]
        F --> G[数据处理]
        G --> H[PostgreSQL]
        G --> I[ClickHouse]
    end
    
    subgraph 可视化
        H --> J[Web 界面]
        I --> K[分析仪表板]
    end
    
    subgraph 自托管选项
        F -.-> L[本地部署]
        H -.-> L
        J -.-> L
    end
    
    style B fill:#d4edda
    style L fill:#fff4e6
```
:::

## 高级用法

### 评分和反馈

```python
from langfuse import Langfuse

langfuse = Langfuse()

# 创建 trace
trace = langfuse.trace(name="customer-support")

# ... 执行 LLM 调用 ...

# 添加用户评分
trace.score(
    name="user-satisfaction",
    value=0.9,  # 0-1 范围
    comment="用户非常满意"
)

# 添加质量评分
trace.score(
    name="response-quality",
    value=0.85,
    source="MODEL"  # MODEL, HUMAN, or EVALUATOR
)
```

### Prompt 管理

```python
from langfuse import Langfuse

langfuse = Langfuse()

# 获取 Prompt（在 Langfuse 界面中管理）
prompt = langfuse.get_prompt(
    name="customer-support-prompt",
    version=1  # 可选，默认最新版本
)

# 使用 Prompt
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model="gpt-4o")

response = llm.invoke(prompt.compile(
    customer_name="林傒",
    issue="订单未发货"
))

# 记录使用的 prompt 版本
trace = langfuse.trace(
    name="support-response",
    metadata={"prompt_version": prompt.version}
)
```

### Experiment 实验

```python
from langfuse import Langfuse
from langchain_openai import ChatOpenAI

langfuse = Langfuse()

# A/B 测试不同模型
models = ["gpt-4o", "gpt-4o-mini", "claude-3-5-sonnet"]

for model in models:
    trace = langfuse.trace(
        name="model-comparison",
        metadata={"model": model, "experiment": "cost-optimization"}
    )
    
    llm = ChatOpenAI(model=model)
    response = llm.invoke("请写一首关于春天的诗")
    
    trace.score(
        name="quality",
        value=evaluate_quality(response)  # 你的评估函数
    )
    
    trace.end()

# 在 Langfuse 界面中比较不同模型的效果
```

### 批量分析

```python
from langfuse import Langfuse

langfuse = Langfuse()

# 获取所有 traces
traces = langfuse.fetch_traces(
    name="customer-support",
    from_timestamp="2024-01-01",
    limit=100
)

# 分析平均响应时间
response_times = [
    trace.latency for trace in traces
]
avg_response_time = sum(response_times) / len(response_times)
print(f"平均响应时间：{avg_response_time:.2f}s")

# 分析用户满意度
satisfaction_scores = [
    score.value
    for trace in traces
    for score in trace.scores
    if score.name == "user-satisfaction"
]
avg_satisfaction = sum(satisfaction_scores) / len(satisfaction_scores)
print(f"平均满意度：{avg_satisfaction:.2f}")
```

## 完整示例：生产级集成

```python
import os
from langfuse.langchain import CallbackHandler
from langchain_openai import ChatOpenAI
from langchain.chains import ConversationChain

# 配置
LANGFUSE_CONFIG = {
    "public_key": os.getenv("LANGFUSE_PUBLIC_KEY"),
    "secret_key": os.getenv("LANGFUSE_SECRET_KEY"),
    "host": os.getenv("LANGFUSE_HOST", "https://cloud.langfuse.com"),
}

# 创建 handler
def create_langfuse_handler(user_id: str, session_id: str):
    return CallbackHandler(
        **LANGFUSE_CONFIG,
        user_id=user_id,
        session_id=session_id,
        trace={
            "metadata": {
                "environment": "production",
                "version": "1.0.0"
            }
        }
    )

# 使用
handler = create_langfuse_handler(
    user_id="customer_001",
    session_id="session_abc"
)

llm = ChatOpenAI(model="gpt-4o")
chain = ConversationChain(llm=llm)

try:
    response = chain.invoke(
        {"input": "你好，我需要帮助"},
        config={"callbacks": [handler]}
    )
except Exception as e:
    # 错误也会被记录
    handler.trace.score(
        name="error",
        value=1,
        comment=str(e)
    )
    raise
finally:
    handler.flush()
```

## 最佳实践

### ✅ 推荐做法

1. **异步 flushing**
   ```python
   # 定期 flush，避免阻塞
   import atexit
   atexit.register(handler.flush)
   ```

2. **错误处理**
   ```python
   try:
       response = chain.invoke(...)
   except Exception as e:
       handler.trace.score(name="error", value=1)
       raise
   finally:
       handler.flush()
   ```

3. **采样（高流量场景）**
   ```python
   import random
   
   if random.random() < 0.1:  # 10% 采样
       config={"callbacks": [handler]}
   ```

4. **敏感数据脱敏**
   ```python
   # 在发送前脱敏
   metadata={
       "user_id": hash_user_id(user_id),  # 脱敏
       "query_preview": query[:50]  # 截断
   }
   ```

### ❌ 避免的问题

1. **不要忘记 flush**
   ```python
   # 错误：程序退出前没 flush，数据丢失
   handler = CallbackHandler(...)
   chain.invoke(...)
   # 缺少 handler.flush()  ❌
   
   # 正确
   try:
       chain.invoke(...)
   finally:
       handler.flush()  # ✅
   ```

2. **不要记录敏感信息**
   ```python
   # 错误
   metadata={"password": "secret"}  # ❌
   
   # 正确
   metadata={"user_segment": "enterprise"}  # ✅
   ```

3. **不要同步等待**
   ```python
   # 错误：阻塞主线程
   handler.flush()  # 在主线程中同步调用
   
   # 正确：后台 flush 或批量
   ```

## 总结

Langfuse 是 LangSmith 的优秀开源替代方案：

**优势：**
- ✅ 开源，代码透明
- ✅ 支持自托管，数据可控
- ✅ 功能完整，与 LangSmith 相当
- ✅ 活跃社区，持续发展

**适用场景：**
- 数据隐私要求高的场景
- 需要自定义和扩展
- 成本敏感，希望自托管
- 多云部署需求

**与 LangSmith 选择指南：**
- 追求简单、快速集成 → LangSmith
- 需要数据控制、自托管 → Langfuse
- 预算有限 → Langfuse（自托管）
- 企业级支持需求 → LangSmith

下一节进入实战篇，我们将构建完整的企业知识库问答 Bot。