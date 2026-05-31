# 手写代码题 8-10 道

本章节整理了 LangChain 相关的编程实现题，每题都有完整参考答案，适合面试准备和实战练习。

## 题目 1：实现自定义 Tool

### 题目要求

实现一个天气查询 Tool，支持以下功能：
- 根据城市名查询天气
- 返回温度、天气状况、湿度
- 支持异步调用
- 添加适当的错误处理

### 参考答案

```python
from langchain_core.tools import tool
from typing import Optional, Dict
import aiohttp
import asyncio

# 方法 1：使用 @tool 装饰器
@tool
async def get_weather(city: str) -> str:
    """
    查询指定城市的天气信息。
    
    参数:
        city: 城市名称，如"北京"、"上海"
    
    返回:
        天气信息字符串，包含温度、天气状况、湿度
    """
    api_key = "your_weather_api_key"
    url = f"http://api.weather.com/v1/current?city={city}&key={api_key}"
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=10) as response:
                if response.status == 200:
                    data = await response.json()
                    return (
                        f"{city}天气：{data['condition']}, "
                        f"温度：{data['temp']}°C, "
                        f"湿度：{data['humidity']}%"
                    )
                else:
                    return f"查询失败：{response.status}"
    except Exception as e:
        return f"天气查询出错：{str(e)}"


# 方法 2：使用 Tool 类（更灵活）
from langchain_core.tools import BaseTool

class WeatherTool(BaseTool):
    """天气查询工具类"""
    
    name = "weather_query"
    description = "查询城市天气，输入城市名，返回温度、天气状况和湿度"
    
    def _run(self, city: str) -> str:
        """同步实现"""
        return asyncio.run(self._async_run(city))
    
    async def _arun(self, city: str) -> str:
        """异步实现"""
        return await self._async_run(city)
    
    async def _async_run(self, city: str) -> str:
        api_key = "your_weather_api_key"
        url = f"http://api.weather.com/v1/current?city={city}&key={api_key}"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=10) as response:
                    response.raise_for_status()
                    data = await response.json()
                    
                    return {
                        "city": city,
                        "temperature": data["temp"],
                        "condition": data["condition"],
                        "humidity": data["humidity"]
                    }
        except aiohttp.ClientError as e:
            raise ValueError(f"API 请求失败：{str(e)}")
        except KeyError as e:
            raise ValueError(f"响应格式错误：缺少{str(e)}")

# 使用示例
tools = [get_weather, WeatherTool()]

from langchain.agents import create_tool_calling_agent
agent = create_tool_calling_agent(llm, tools, prompt)
```

---

## 题目 2：实现 LCEL 管道

### 题目要求

使用 LCEL 构建一个文档问答管道，要求：
- 接收用户问题
- 从向量库检索相关文档
- 构建带上下文的 Prompt
- 调用 LLM 生成答案
- 支持流式输出

### 参考答案

```python
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from typing import List

# 假设已有组件
class MockVectorStore:
    def similarity_search(self, query: str, k: int = 3):
        # 模拟检索
        return [
            Document(page_content="文档内容 1", metadata={"source": "doc1.pdf"}),
            Document(page_content="文档内容 2", metadata={"source": "doc2.pdf"}),
        ]

vectorstore = MockVectorStore()
llm = ChatOpenAI(model="gpt-4o")

# 步骤 1：定义检索函数
def retrieve_docs(query: str):
    docs = vectorstore.similarity_search(query, k=3)
    return docs

# 步骤 2：定义文档格式化函数
def format_docs(docs: List[Document]) -> str:
    return "\n\n".join([
        f"[来源{  i+1}: {doc.metadata['source']}]\n{doc.page_content}"
        for i, doc in enumerate(docs)
    ])

# 步骤 3：定义 Prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", """你是一个问答助手。基于以下资料回答问题。
如果资料中没有答案，直接说"资料不足，无法回答"。

资料：
{context}
"""),
    ("human", "问题：{question}")
])

# 步骤 4：构建 LCEL 管道
rag_chain = (
    {
        "context": RunnableLambda(retrieve_docs) | RunnableLambda(format_docs),
        "question": RunnablePassthrough()
    }
    | prompt
    | llm
    | StrOutputParser()
)

# 使用
# 1. 普通调用
answer = rag_chain.invoke("公司年假有多少天？")

# 2. 流式调用
for chunk in rag_chain.stream("公司年假有多少天？"):
    print(chunk, end="", flush=True)

# 3. 批量调用
answers = rag_chain.batch([
    "年假多少天？",
    "病假怎么算？",
    "加班有补贴吗？"
])
```

---

## 题目 3：实现 RAG 检索

### 题目要求

实现一个混合检索函数，结合 BM25 和向量相似度：
- 输入：查询语句、文档列表
- 输出：排序后的文档列表
- 使用 RRF 融合算法
- 可调节两种检索的权重

### 参考答案

```python
from typing import List, Tuple, Dict
from langchain_core.documents import Document
from collections import defaultdict
import math

class HybridRetriever:
    """混合检索器"""
    
    def __init__(
        self,
        embeddings,
        bm25_index,
        k: int = 5,
        alpha: float = 0.5,
        rrf_k: int = 60
    ):
        self.embeddings = embeddings
        self.bm25_index = bm25_index  # 假设已有 BM25 索引
        self.k = k
        self.alpha = alpha  # 向量检索权重
        self.rrf_k = rrf_k  # RRF 参数
    
    def retrieve(self, query: str) -> List[Tuple[Document, float]]:
        """执行混合检索"""
        # 1. 向量检索
        dense_results = self._dense_search(query)
        
        # 2. BM25 检索
        sparse_results = self._sparse_search(query)
        
        # 3. RRF 融合
        fused = self._rrf_fusion(dense_results, sparse_results)
        
        return fused[:self.k]
    
    def _dense_search(self, query: str) -> List[Tuple[Document, float]]:
        """向量检索"""
        # 实际项目中调用向量数据库
        query_embedding = self.embeddings.embed_query(query)
        results = self.vectorstore.similarity_search_with_score(query, k=20)
        return results
    
    def _sparse_search(self, query: str) -> List[Document]:
        """BM25 检索"""
        # 实际项目中调用 BM25
        return self.bm25_index.search(query, k=20)
    
    def _rrf_fusion(
        self,
        dense: List[Tuple[Document, float]],
        sparse: List[Document]
    ) -> List[Tuple[Document, float]]:
        """RRF 融合"""
        scores = defaultdict(float)
        doc_map = {}
        
        # 稠密结果计分
        for rank, (doc, _) in enumerate(dense):
            doc_id = id(doc.page_content)
            scores[doc_id] += self.alpha * (1 / (self.rrf_k + rank + 1))
            doc_map[doc_id] = doc
        
        # 稀疏结果计分
        for rank, doc in enumerate(sparse):
            doc_id = id(doc.page_content)
            scores[doc_id] += (1 - self.alpha) * (1 / (self.rrf_k + rank + 1))
            doc_map[doc_id] = doc
        
        # 排序
        sorted_docs = sorted(
            scores.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        return [(doc_map[doc_id], score) for doc_id, score in sorted_docs]


# 简化版（面试可用）
def hybrid_search(
    query: str,
    dense_results: List[Tuple[Document, float]],
    sparse_results: List[Document],
    k: int = 5,
    alpha: float = 0.5
) -> List[Document]:
    """
    简化版混合检索
    
    Args:
        query: 查询
        dense_results: 向量检索结果 [(doc, score)]
        sparse_results: BM25 检索结果 [doc]
        k: 返回数量
        alpha: 向量检索权重 (0-1)
    
    Returns:
        融合后的文档列表
    """
    from collections import defaultdict
    
    scores = defaultdict(float)
    docs = {}
    
    # 向量结果
    for rank, (doc, _) in enumerate(dense_results):
        doc_id = hash(doc.page_content)
        scores[doc_id] += alpha / (60 + rank)
        docs[doc_id] = doc
    
    # BM25 结果
    for rank, doc in enumerate(sparse_results):
        doc_id = hash(doc.page_content)
        scores[doc_id] += (1 - alpha) / (60 + rank)
        docs[doc_id] = doc
    
    # 排序返回
    sorted_ids = sorted(scores.keys(), key=lambda x: scores[x], reverse=True)
    return [docs[doc_id] for doc_id in sorted_ids[:k]]
```

---

## 题目 4：实现记忆组件

### 题目要求

实现一个简单的对话记忆组件，要求：
- 存储对话历史
- 可配置最大轮数
- 支持保存和加载
- 线程安全

### 参考答案

```python
from typing import List, Dict, Any, Optional
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langchain.memory import ConversationBufferMemory
import threading
import json
from pathlib import Path

class ThreadSafeMemory(ConversationBufferMemory):
    """线程安全的对话记忆"""
    
    def __init__(self, max_messages: int = 10, persist_path: Optional[str] = None):
        super().__init__(return_messages=True)
        self.max_messages = max_messages
        self.persist_path = Path(persist_path) if persist_path else None
        self._lock = threading.Lock()
        
        # 加载已有记忆
        if self.persist_path and self.persist_path.exists():
            self._load()
    
    def save_context(self, inputs: Dict[str, Any], outputs: Dict[str, Any]) -> None:
        """保存对话（线程安全）"""
        with self._lock:
            # 获取输入输出
            input_val = inputs.get(self.input_key or "input")
            output_val = outputs.get(self.output_key or "output")
            
            # 添加消息
            self.chat_memory.add_user_message(input_val)
            self.chat_memory.add_ai_message(output_val)
            
            # 限制消息数量
            messages = self.chat_memory.messages
            if len(messages) > self.max_messages * 2:  # 每轮 2 条消息
                self.chat_memory.messages = messages[-self.max_messages * 2:]
            
            # 持久化
            if self.persist_path:
                self._save()
    
    def clear(self) -> None:
        """清除记忆（线程安全）"""
        with self._lock:
            super().clear()
            if self.persist_path:
                self.persist_path.unlink(missing_ok=True)
    
    def _save(self) -> None:
        """保存到磁盘"""
        messages_data = []
        for msg in self.chat_memory.messages:
            messages_data.append({
                "type": msg.type,
                "content": msg.content
            })
        
        with open(self.persist_path, 'w', encoding='utf-8') as f:
            json.dump({"messages": messages_data}, f, ensure_ascii=False)
    
    def _load(self) -> None:
        """从磁盘加载"""
        with open(self.persist_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        self.chat_memory.messages = []
        for msg_data in data["messages"]:
            if msg_data["type"] == "human":
                self.chat_memory.add_user_message(msg_data["content"])
            else:
                self.chat_memory.add_ai_message(msg_data["content"])
    
    def get_messages(self) -> List[BaseMessage]:
        """获取消息列表（线程安全）"""
        with self._lock:
            return self.chat_memory.messages.copy()


# 使用示例
memory = ThreadSafeMemory(
    max_messages=5,
    persist_path="./memory.json"
)

# 保存对话
memory.save_context(
    {"input": "你好"},
    {"output": "你好！有什么可以帮助你的？"}
)

# 获取历史
messages = memory.get_messages()
```

---

## 题目 5：实现 Callback Handler

### 题目要求

实现一个 Token 统计 Callback Handler，要求：
- 统计每次 LLM 调用的 token 使用
- 累计总消耗
- 估算成本
- 支持导出报告

### 参考答案

```python
from langchain_core.callbacks import BaseCallbackHandler
from typing import Any, Dict, List, Optional
from uuid import UUID
from dataclasses import dataclass, field
from datetime import datetime
import json

@dataclass
class TokenUsage:
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0
    cost: float = 0.0

@dataclass
class CallRecord:
    run_id: UUID
    model: str
    timestamp: datetime
    usage: TokenUsage

class TokenUsageHandler(BaseCallbackHandler):
    """Token 用量统计 Handler"""
    
    # 模型价格表（每 1K tokens）
    PRICES = {
        "gpt-4o": {"prompt": 0.000005, "completion": 0.000015},
        "gpt-4o-mini": {"prompt": 0.0000015, "completion": 0.000006},
        "gpt-3.5-turbo": {"prompt": 0.0000005, "completion": 0.0000015},
    }
    
    def __init__(self):
        self.total_usage = TokenUsage()
        self.calls: List[CallRecord] = []
        self.current_calls: Dict[UUID, Dict] = {}
    
    def on_llm_start(
        self,
        serialized: Dict[str, Any],
        prompts: List[str],
        *,
        run_id: UUID,
        **kwargs: Any
    ) -> None:
        """LLM 调用开始"""
        model = serialized.get("kwargs", {}).get("model_name", "unknown")
        self.current_calls[run_id] = {
            "model": model,
            "start_time": datetime.now()
        }
    
    def on_llm_end(
        self,
        response,
        *,
        run_id: UUID,
        **kwargs: Any
    ) -> None:
        """LLM 调用结束"""
        call_info = self.current_calls.pop(run_id, {})
        
        # 提取 token 使用
        usage = TokenUsage()
        if response.llm_output and "token_usage" in response.llm_output:
            token_data = response.llm_output["token_usage"]
            usage.prompt_tokens = token_data.get("prompt_tokens", 0)
            usage.completion_tokens = token_data.get("completion_tokens", 0)
            usage.total_tokens = token_data.get("total_tokens", 0)
        
        # 计算成本
        model = call_info.get("model", "gpt-4o")
        price = self.PRICES.get(model, self.PRICES["gpt-4o"])
        usage.cost = (
            usage.prompt_tokens * price["prompt"] +
            usage.completion_tokens * price["completion"]
        )
        
        # 更新总计
        self.total_usage.prompt_tokens += usage.prompt_tokens
        self.total_usage.completion_tokens += usage.completion_tokens
        self.total_usage.total_tokens += usage.total_tokens
        self.total_usage.cost += usage.cost
        
        # 记录调用
        self.calls.append(CallRecord(
            run_id=run_id,
            model=model,
            timestamp=call_info.get("start_time", datetime.now()),
            usage=usage
        ))
    
    def get_report(self) -> Dict[str, Any]:
        """生成使用报告"""
        by_model: Dict[str, TokenUsage] = {}
        
        for call in self.calls:
            if call.model not in by_model:
                by_model[call.model] = TokenUsage()
            model_usage = by_model[call.model]
            model_usage.prompt_tokens += call.usage.prompt_tokens
            model_usage.completion_tokens += call.usage.completion_tokens
            model_usage.total_tokens += call.usage.total_tokens
            model_usage.cost += call.usage.cost
        
        return {
            "summary": {
                "total_calls": len(self.calls),
                "total_tokens": self.total_usage.total_tokens,
                "total_cost": self.total_usage.cost,
                "avg_tokens_per_call": self.total_usage.total_tokens / max(len(self.calls), 1)
            },
            "by_model": {
                model: {
                    "calls": sum(1 for c in self.calls if c.model == model),
                    "total_tokens": usage.total_tokens,
                    "cost": usage.cost
                }
                for model, usage in by_model.items()
            },
            "recent_calls": [
                {
                    "model": call.model,
                    "timestamp": call.timestamp.isoformat(),
                    "tokens": call.usage.total_tokens,
                    "cost": call.usage.cost
                }
                for call in self.calls[-10:]  # 最近 10 次
            ]
        }
    
    def export_json(self, filepath: str) -> None:
        """导出报告到 JSON"""
        report = self.get_report()
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
    
    def reset(self) -> None:
        """重置统计"""
        self.total_usage = TokenUsage()
        self.calls.clear()
        self.current_calls.clear()


# 使用示例
handler = TokenUsageHandler()

# 在调用中使用
response = chain.invoke(
    {"input": "你好"},
    config={"callbacks": [handler]}
)

# 查看报告
report = handler.get_report()
print(f"总消耗：${report['summary']['total_cost']:.4f}")

# 导出报告
handler.export_json("token_usage.json")
```

---

## 题目 6: 实现 Agent 执行器

### 题目要求

实现一个简单的 Agent 执行器，要求：
- 支持工具调用
- 实现 ReAct 循环
- 限制最大迭代次数
- 处理执行错误

### 参考答案

```python
from typing import List, Dict, Any, Optional
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from langchain_core.tools import BaseTool
from langchain_openai import ChatOpenAI
import re

class SimpleAgentExecutor:
    """简单 Agent 执行器"""
    
    def __init__(
        self,
        llm: ChatOpenAI,
        tools: List[BaseTool],
        max_iterations: int = 5,
        verbose: bool = False
    ):
        self.llm = llm
        self.tools = {tool.name: tool for tool in tools}
        self.max_iterations = max_iterations
        self.verbose = verbose
    
    def _build_prompt(self, messages: List, tools_info: str) -> str:
        """构建 ReAct Prompt"""
        system_prompt = f"""你是一个智能助手，可以使用以下工具：

{tools_info}

回答格式：
Thought: 你的思考
Action: 工具名
Action Input: 工具输入参数

或者

Thought: 你的思考
Final Answer: 最终回答
"""
        return system_prompt
    
    def _parse_action(self, response: str) -> Optional[Dict]:
        """解析 Action"""
        # 使用正则解析
        action_pattern = r"Action:\s*(\w+)\nAction Input:\s*(.+?)(?=\n|$)"
        match = re.search(action_pattern, response, re.DOTALL)
        
        if match:
            return {
                "action": match.group(1),
                "input": match.group(2).strip()
            }
        
        # 检查最终回答
        answer_pattern = r"Final Answer:\s*(.+)"
        match = re.search(answer_pattern, response, re.DOTALL)
        
        if match:
            return {
                "final_answer": match.group(1).strip()
            }
        
        return None
    
    def invoke(self, user_input: str) -> str:
        """执行 Agent"""
        messages = [HumanMessage(content=user_input)]
        
        # 构建工具描述
        tools_info = "\n".join([
            f"- {tool.name}: {tool.description}"
            for tool in self.tools.values()
        ])
        
        for iteration in range(self.max_iterations):
            if self.verbose:
                print(f"\n=== 迭代 {iteration + 1} ===")
            
            # 调用 LLM
            response = self.llm.invoke(messages).content
            
            if self.verbose:
                print(f"LLM 响应：{response[:200]}...")
            
            # 解析响应
            parsed = self._parse_action(response)
            
            if not parsed:
                # 无法解析，尝试直接回答
                messages.append(AIMessage(content=response))
                return response
            
            # 检查是否是最终回答
            if "final_answer" in parsed:
                return parsed["final_answer"]
            
            # 执行工具
            action = parsed["action"]
            action_input = parsed["input"]
            
            if action not in self.tools:
                error_msg = f"未知工具：{action}"
                if self.verbose:
                    print(f"错误：{error_msg}")
                messages.append(AIMessage(content=error_msg))
                continue
            
            try:
                tool = self.tools[action]
                observation = tool.run(action_input)
                
                if self.verbose:
                    print(f"工具 {action} 返回：{observation[:100]}...")
                
                # 添加工具结果
                messages.append(AIMessage(content=f"Action: {action}"))
                messages.append(ToolMessage(content=str(observation), tool_call_id=action))
                
            except Exception as e:
                error_msg = f"工具执行错误：{str(e)}"
                if self.verbose:
                    print(f"错误：{error_msg}")
                messages.append(ToolMessage(content=error_msg, tool_call_id=action))
        
        # 达到最大迭代次数
        return "达到最大迭代次数，未能完成任务。"


# 使用示例
from langchain_core.tools import tool

@tool
def search(query: str) -> str:
    """搜索信息"""
    return f"搜索结果：关于{query}的信息"

@tool
def calculator(expr: str) -> float:
    """计算表达式"""
    return eval(expr)

llm = ChatOpenAI(model="gpt-4o")
executor = SimpleAgentExecutor(
    llm=llm,
    tools=[search, calculator],
    max_iterations=5,
    verbose=True
)

result = executor.invoke("计算 3.14 * 100 的结果")
print(f"结果：{result}")
```

---

## 题目 7：实现文档加载器

### 题目要求

实现一个支持多种格式的文档加载器：
- 支持 PDF、Markdown、TXT
- 提取元数据（来源、页数等）
- 批量加载
- 错误处理

### 参考答案

```python
from pathlib import Path
from typing import List, Dict, Any
from langchain_core.documents import Document
import hashlib

class MultiFormatLoader:
    """多格式文档加载器"""
    
    SUPPORTED_FORMATS = {
        ".pdf": "pdf",
        ".md": "markdown",
        ".txt": "text",
        ".docx": "word"
    }
    
    def __init__(self, encoding: str = "utf-8"):
        self.encoding = encoding
    
    def load_directory(self, dir_path: str) -> List[Document]:
        """加载目录下所有支持的文档"""
        path = Path(dir_path)
        documents = []
        
        for ext, format_type in self.SUPPORTED_FORMATS.items():
            for file_path in path.rglob(f"*{ext}"):
                try:
                    docs = self.load_file(str(file_path))
                    documents.extend(docs)
                except Exception as e:
                    print(f"加载失败 {file_path}: {e}")
        
        return documents
    
    def load_file(self, file_path: str) -> List[Document]:
        """加载单个文件"""
        path = Path(file_path)
        ext = path.suffix.lower()
        
        if ext not in self.SUPPORTED_FORMATS:
            raise ValueError(f"不支持的格式：{ext}")
        
        format_type = self.SUPPORTED_FORMATS[ext]
        
        # 读取内容
        content = self._read_file(path, format_type)
        
        # 生成元数据
        metadata = self._extract_metadata(path, format_type, content)
        
        # 创建文档
        doc = Document(page_content=content, metadata=metadata)
        return [doc]
    
    def _read_file(self, path: Path, format_type: str) -> str:
        """读取文件内容"""
        if format_type == "text" or format_type == "markdown":
            with open(path, 'r', encoding=self.encoding) as f:
                return f.read()
        
        elif format_type == "pdf":
            # 实际项目中用 PyPDF2 或 pdfplumber
            try:
                import pdfplumber
                text = []
                with pdfplumber.open(path) as pdf:
                    for page in pdf.pages:
                        text.append(page.extract_text())
                return "\n".join(text)
            except ImportError:
                raise ImportError("请安装 pdfplumber: pip install pdfplumber")
        
        elif format_type == "word":
            # 实际项目中用 python-docx
            try:
                from docx import Document as DocxDocument
                doc = DocxDocument(path)
                return "\n".join([p.text for p in doc.paragraphs])
            except ImportError:
                raise ImportError("请安装 python-docx: pip install python-docx")
        
        raise ValueError(f"未知格式：{format_type}")
    
    def _extract_metadata(
        self,
        path: Path,
        format_type: str,
        content: str
    ) -> Dict[str, Any]:
        """提取元数据"""
        import os
        from datetime import datetime
        
        stat = path.stat()
        
        return {
            "source": str(path),
            "filename": path.name,
            "format": format_type,
            "size_bytes": stat.st_size,
            "content_length": len(content),
            "content_hash": hashlib.md5(content.encode()).hexdigest()[:12],
            "created_at": datetime.fromtimestamp(stat.st_ctime).isoformat(),
            "modified_at": datetime.fromtimestamp(stat.st_mtime).isoformat()
        }


# 使用示例
loader = MultiFormatLoader()

# 加载单个文件
docs = loader.load_file("./docs/manual.pdf")
print(f"加载了 {len(docs)} 个文档")
print(f"元数据：{docs[0].metadata}")

# 加载整个目录
all_docs = loader.load_directory("./docs")
print(f"目录共加载 {len(all_docs)} 个文档")
```

---

## 题目 8：实现评估函数

### 题目要求

实现 RAG 系统的答案评估函数：
- 评估答案准确性
- 评估相关性
- 评估事实一致性
- 返回结构化评分

### 参考答案

```python
from typing import Dict, List, Optional
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
import json

class EvaluationResult(BaseModel):
    """评估结果"""
    accuracy: float = Field(description="准确性评分 (0-1)")
    relevance: float = Field(description="相关性评分 (0-1)")
    faithfulness: float = Field(description="事实一致性评分 (0-1)")
    explanation: str = Field(description="评分理由")

class RAGEvaluator:
    """RAG 评估器"""
    
    def __init__(self, model: str = "gpt-4o"):
        self.llm = ChatOpenAI(model=model, temperature=0)
        self._setup_prompts()
    
    def _setup_prompts(self):
        """设置评估 Prompt"""
        self.eval_prompt = ChatPromptTemplate.from_messages([
            ("system", """你是一个 RAG 系统评估专家。
评估以下问答的质量。

评估维度：
1. 准确性 (Accuracy): 答案是否正确回答了问题
2. 相关性 (Relevance): 答案是否与检索到的文档相关
3. 事实一致性 (Faithfulness): 答案是否忠实于文档，无编造

每个维度评分 0-1，并提供详细理由。

请以 JSON 格式返回评估结果。"""),
            ("human", """问题：{question}
答案：{answer}
参考文档：
{context}

请评估答案质量：""")
        ])
    
    def evaluate(
        self,
        question: str,
        answer: str,
        context: List[str]
    ) -> EvaluationResult:
        """评估单个问答"""
        context_text = "\n\n".join([f"[{i+1}] {doc}" for i, doc in enumerate(context)])
        
        prompt = self.eval_prompt.format(
            question=question,
            answer=answer,
            context=context_text
        )
        
        # 使用结构化输出
        from langchain_core.output_parsers import PydanticOutputParser
        parser = PydanticOutputParser(pydantic_object=EvaluationResult)
        
        chain = self.eval_prompt | self.llm.with_structured_output(EvaluationResult)
        
        result = chain.invoke({
            "question": question,
            "answer": answer,
            "context": context_text
        })
        
        return result
    
    def evaluate_batch(
        self,
        test_cases: List[Dict[str, str]]
    ) -> Dict[str, float]:
        """批量评估"""
        results = []
        
        for case in test_cases:
            result = self.evaluate(
                question=case["question"],
                answer=case["answer"],
                context=case["context"]
            )
            results.append(result)
        
        # 统计
        return {
            "avg_accuracy": sum(r.accuracy for r in results) / len(results),
            "avg_relevance": sum(r.relevance for r in results) / len(results),
            "avg_faithfulness": sum(r.faithfulness for r in results) / len(results),
            "total_cases": len(results)
        }


# 使用示例
evaluator = RAGEvaluator()

# 单个评估
result = evaluator.evaluate(
    question="公司年假有多少天？",
    answer="员工享有 15 天带薪年假",
    context=["员工手册规定：正式员工每年 15 天年假"]
)

print(f"准确性：{result.accuracy}")
print(f"相关性：{result.relevance}")
print(f"一致性：{result.faithfulness}")
print(f"理由：{result.explanation}")

# 批量评估
test_cases = [
    {
        "question": "...",
        "answer": "...",
        "context": ["..."]
    },
    # 更多测试用例
]

stats = evaluator.evaluate_batch(test_cases)
print(f"平均准确性：{stats['avg_accuracy']:.2f}")
```

---

## 总结

这些手写代码题涵盖了 LangChain 开发的核心技能：

✅ **Tool 开发**：自定义工具和异步支持
✅ **LCEL 管道**：声明式编排
✅ **RAG 检索**：混合检索和 RRF 融合
✅ **记忆组件**：线程安全和持久化
✅ **Callback**：Token 统计和监控
✅ **Agent**：ReAct 循环和执行器
✅ **文档处理**：多格式加载
✅ **评估系统**：质量评估指标

**练习建议：**
1. 先理解题意，不要急着写代码
2. 考虑边界情况和错误处理
3. 写完后自己测试
4. 对比参考答案，学习优化点