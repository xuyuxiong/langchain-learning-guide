---
title: LangServe 快速部署
description: 使用 LangServe 快速将 LangChain 应用部署为 REST API
---

# LangServe 快速部署

LangServe 是 LangChain 团队推出的部署库，可以将任何 LangChain Runnable（链、Agent、Retriever 等）快速部署为 REST API。本章将介绍 LangServe 的基础用法、端点说明和生产部署最佳实践。

::: v-pre
```mermaid
flowchart TB
    subgraph 开发环境
        A[LangChain Chain] --> B[LangServe add_routes]
        B --> C[FastAPI 应用]
    end
    
    subgraph 自动生成的端点
        C --> D1[/invoke]
        C --> D2[/batch]
        C --> D3[/stream]
        C --> D4[/input_schema]
        C --> D5[/output_schema]
    end
    
    subgraph 客户端访问
        E[Python Client] --> D1
        F[JS Client] --> D2
        G[curl] --> D3
    end
    
    subgraph 可观测性
        C --> H[LangSmith 追踪]
    end
    
    style A fill:#e3f2fd
    style B fill:#bbdefb
    style C fill:#90caf9
    style D1 fill:#64b5f6,color:#fff
    style D2 fill:#64b5f6,color:#fff
    style D3 fill:#64b5f6,color:#fff
    style H fill:#c8e6c9
```
:::

## 什么是 LangServe？

LangServe 是一个部署库，它将 LangChain 的可组合抽象（Runnable）转换为标准的 REST API。主要特点：

| 特性 | 说明 |
|------|------|
| **零配置** | 一行代码添加路由 |
| **自动文档** | 自动生成 OpenAPI 文档和 Playground |
| **多端点** | 自动生成 invoke/batch/stream 等端点 |
| **类型安全** | 自动推断输入输出 Schema |
| **流式支持** | 内置 SSE 流式输出 |
| **客户端库** | 提供 Python/JS SDK |

## 最小可运行示例

### 第一步：安装依赖

```bash
# 安装 LangServe
pip install langserve

# 安装 FastAPI 和 uvicorn（LangServe 的依赖）
pip install "langserve[all]"

# 或者完整安装
pip install langchain langchain-openai langserve fastapi uvicorn sse-starlette
```

### 第二步：创建 Chain

```python
# chain.py
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 定义提示词
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个专业的翻译助手，将中文翻译成{target_language}。"),
    ("human", "{text}")
])

# 定义模型
model = ChatOpenAI(model="gpt-4o", temperature=0.7)

# 创建链
chain = prompt | model | StrOutputParser()
```

### 第三步：创建 FastAPI 应用

```python
# server.py
from fastapi import FastAPI
from langserve import add_routes
from chain import chain  # 导入上面定义的 chain

# 创建 FastAPI 应用
app = FastAPI(
    title="翻译 API",
    description="使用 LangChain 构建的翻译服务",
    version="1.0.0"
)

# 添加 LangServe 路由
add_routes(
    app,
    chain,
    path="/translate",
    enabled_endpoints=["invoke", "batch", "stream"]
)

# 健康检查端点
@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### 第四步：运行服务

```bash
# 启动服务
python server.py

# 服务将在 http://localhost:8000 运行
```

### 第五步：访问 API

**使用 Playground（浏览器）：**
```
http://localhost:8000/translate/playground/
```

**使用 curl：**
```bash
# Invoke 端点
curl -X POST http://localhost:8000/translate/invoke \
  -H "Content-Type: application/json" \
  -d '{"text": "你好世界", "target_language": "英语"}'

# 查看 OpenAPI 文档
curl http://localhost:8000/openapi.json
```

**使用 Python 客户端：**
```python
from langserve import RemoteRunnable

# 连接远程服务
remote_chain = RemoteRunnable("http://localhost:8000/translate")

# 调用
result = remote_chain.invoke({
    "text": "你好，世界！",
    "target_language": "英语"
})

print(result)  # 输出：Hello, World!
```

## add_routes 基础用法

### 基本参数

```python
from fastapi import FastAPI
from langserve import add_routes

app = FastAPI()

# 基础用法
add_routes(
    app,
    chain,                          # 必需：LangChain Runnable
    path="/my-chain",               # 可选：路径前缀，默认"/"
    enabled_endpoints=None,         # 可选：启用的端点列表
    disabled_endpoints=None,        # 可选：禁用的端点列表
    input_schema=None,              # 可选：自定义输入 Schema
    output_schema=None,             # 可选：自定义输出 Schema
    config_keys=("configurable",),  # 可选：允许的配置键
)
```

### 端点控制

```python
# 只启用特定端点
add_routes(
    app,
    chain,
    enabled_endpoints=["invoke", "stream"]  # 只启用 invoke 和 stream
)

# 禁用特定端点
add_routes(
    app,
    chain,
    disabled_endpoints=["batch"]  # 禁用 batch
)

# 可用端点列表
# - invoke: 单次调用
# - batch: 批量调用
# - stream: 流式输出
# - stream_log: 带日志的流式输出
# - input_schema: 获取输入 Schema
# - output_schema: 获取输出 Schema
# - config_schema: 获取配置 Schema
# - playground: Web 测试界面
```

### 多链部署

```python
from fastapi import FastAPI
from langserve import add_routes

app = FastAPI()

# 部署多个链
add_routes(app, translation_chain, path="/translate")
add_routes(app, summarization_chain, path="/summarize")
add_routes(app, qa_chain, path="/qa")
add_routes(app, agent_chain, path="/agent")

# 访问不同端点：
# http://localhost:8000/translate/invoke
# http://localhost:8000/summarize/invoke
# http://localhost:8000/qa/invoke
# http://localhost:8000/agent/invoke
```

### 版本化部署

```python
from fastapi import FastAPI
from langserve import add_routes

app = FastAPI()

# 不同版本的链使用不同路径
add_routes(app, chain_v1, path="/api/v1/translate")
add_routes(app, chain_v2, path="/api/v2/translate")

# 客户端可以明确指定版本
# v1_client = RemoteRunnable("http://localhost:8000/api/v1/translate")
# v2_client = RemoteRunnable("http://localhost:8000/api/v2/translate")
```

## API 端点详解

### /invoke - 单次调用

最基础的端点，用于单次同步调用。

```python
import requests

response = requests.post(
    "http://localhost:8000/translate/invoke",
    json={"text": "你好", "target_language": "英语"}
)

result = response.json()
print(result["output"])  # 翻译结果
```

**请求格式：**
```json
{
    "text": "你好",
    "target_language": "英语"
}
```

**响应格式：**
```json
{
    "output": "Hello",
    "metadata": {
        "run_id": "uuid-string",
        "feedback_tokens": {...}
    }
}
```

### /batch - 批量调用

批量处理多个请求，提高效率。

```python
import requests

response = requests.post(
    "http://localhost:8000/translate/batch",
    json={
        "inputs": [
            {"text": "你好", "target_language": "英语"},
            {"text": "谢谢", "target_language": "英语"},
            {"text": "再见", "target_language": "英语"}
        ],
        "max_concurrency": 3  # 最大并发数
    }
)

results = response.json()
for r in results:
    print(r["output"])
```

### /stream - 流式输出

使用 Server-Sent Events (SSE) 实现流式输出。

```python
import requests

response = requests.post(
    "http://localhost:8000/translate/stream",
    json={"text": "这是一段很长的文本需要翻译...", "target_language": "英语"},
    stream=True
)

for line in response.iter_lines():
    if line:
        # 解析 SSE 事件
        print(line.decode())
```

### /input_schema - 输入 Schema

获取链的输入 JSON Schema。

```bash
curl http://localhost:8000/translate/input_schema
```

**响应示例：**
```json
{
    "title": "TranslateInput",
    "type": "object",
    "properties": {
        "text": {
            "title": "Text",
            "type": "string"
        },
        "target_language": {
            "title": "Target Language",
            "type": "string"
        }
    },
    "required": ["text", "target_language"]
}
```

### /output_schema - 输出 Schema

获取链的输出 JSON Schema。

```bash
curl http://localhost:8000/translate/output_schema
```

## FastAPI 集成

### 添加中间件

```python
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from langserve import add_routes
import time

app = FastAPI()

# CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 日志中间件
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    print(f"{request.method} {request.url.path} - {duration:.2f}s")
    return response

add_routes(app, chain, path="/api")
```

### 自定义路由

```python
from fastapi import FastAPI, Header, HTTPException
from langserve import add_routes
from typing import Optional

app = FastAPI()

add_routes(app, chain, path="/api")

# 添加自定义路由
@app.get("/custom/info")
def custom_info():
    return {
        "service": "Translation API",
        "version": "1.0.0",
        "endpoints": ["/api/invoke", "/api/batch", "/api/stream"]
    }

# 添加认证的路由
@app.post("/api/premium/invoke")
async def premium_invoke(
    request: dict,
    x_api_key: Optional[str] = Header(None)
):
    if x_api_key != "premium-key-123":
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    # 调用链
    result = await chain.ainvoke(request)
    return {"output": result}
```

### 依赖注入

```python
from fastapi import FastAPI, Depends, HTTPException
from langserve import add_routes
from sqlalchemy.orm import Session

app = FastAPI()

# 数据库依赖
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 认证依赖
def verify_api_key(x_api_key: str = Header(...)):
    if not is_valid_key(x_api_key):
        raise HTTPException(status_code=401, detail="Invalid API key")
    return x_api_key

add_routes(
    app,
    chain,
    path="/api",
    dependencies=[Depends(verify_api_key)]  # 添加认证依赖
)
```

## 配置选项

### 可配置字段

```python
from langchain_core.runnables import RunnableConfigurableFields
from langserve import add_routes

# 创建可配置的链
configurable_chain = chain.configurable_fields(
    temperature=ConfigurableField(
        id="temperature",
        name="Temperature",
        description="模型的温度参数",
    ),
    model=ConfigurableField(
        id="model",
        name="Model",
        description="使用的模型",
    )
)

add_routes(
    app,
    configurable_chain,
    config_keys=["configurable"],  # 允许客户端传递配置
)
```

### 客户端传递配置

```python
from langserve import RemoteRunnable

remote_chain = RemoteRunnable("http://localhost:8000/api")

# 传递配置
result = remote_chain.invoke(
    {"text": "你好", "target_language": "英语"},
    config={"configurable": {"temperature": 0.9, "model": "gpt-4o"}}
)
```

## 生产部署考虑

### 环境变量配置

```python
# server.py
import os
from fastapi import FastAPI
from langserve import add_routes

app = FastAPI(
    title=os.getenv("API_TITLE", "LangChain API"),
    description=os.getenv("API_DESCRIPTION", "LLM Service"),
    version=os.getenv("API_VERSION", "1.0.0")
)

add_routes(app, chain, path="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        workers=int(os.getenv("WORKERS", 1)),
        log_level=os.getenv("LOG_LEVEL", "info")
    )
```

### Docker 部署

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制代码
COPY . .

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - LANGSMITH_API_KEY=${LANGSMITH_API_KEY}
    restart: unless-stopped
```

## 性能优化

### 连接池

```python
from langchain_openai import ChatOpenAI
from httpx import Client, AsyncClient

# 配置同步客户端
sync_client = Client()
llm_sync = ChatOpenAI(client=sync_client)

# 配置异步客户端
async_client = AsyncClient()
llm_async = ChatOpenAI(client=async_client)
```

### 并发限制

```python
from asyncio import Semaphore

class RateLimitedChain:
    def __init__(self, chain, max_concurrent=10):
        self.chain = chain
        self.semaphore = Semaphore(max_concurrent)
    
    async def ainvoke(self, inputs):
        async with self.semaphore:
            return await self.chain.ainvoke(inputs)

# 使用
rate_limited = RateLimitedChain(chain, max_concurrent=5)
```

## 常见问题

### Q1: LangServe 和 FastAPI 有什么区别？

A: LangServe 是基于 FastAPI 构建的，专门用于部署 LangChain 应用。它自动处理链的序列化、配置传递和流式输出，但底层仍然是 FastAPI。

### Q2: 如何添加认证？

A: 使用 FastAPI 的认证中间件或依赖注入，参考上面的"自定义路由"部分。

### Q3: 如何处理大文件上传？

A: 对于大输入，建议使用：
1. 增加请求体大小限制
2. 使用文件上传端点
3. 考虑使用对象存储

```python
from fastapi import UploadFile

@app.post("/upload")
async def upload_file(file: UploadFile):
    content = await file.read()
    result = chain.invoke({"document": content.decode()})
    return result
```

### Q4: 如何监控 API 性能？

A: 集成 LangSmith 追踪、添加 Prometheus 指标、或使用 APM 工具。

## 下一步

- 学习 [API 设计最佳实践](/langserve/api-design)
- 了解 [流式输出详解](/langserve/streaming-output)
- 探索 [认证与限流](/langserve/auth-rate-limit)

---

<Badge type="info" text="最后更新：2026-05-31" />
<Badge type="tip" text="LangServe 版本：0.3+" />