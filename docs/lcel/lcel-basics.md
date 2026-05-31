# LCEL 基础与设计哲学

LCEL（LangChain Expression Language，LangChain 表达式语言）是 LangChain v0.0.17 引入的声明式链构建范式，代表了 LangChain 从命令式编程向函数式编程的重大转变。

## 为什么需要 LCEL？

在 LCEL 出现之前，LangChain 使用传统的命令式链（Legacy Chain）来组合组件。这种方式存在诸多问题：

### Legacy Chain 的痛点

1. **缺乏类型安全**：组件之间的输入输出类型不透明，运行时才能获得类型信息
2. **难以并行化**：顺序执行的代码结构无法自动优化并行执行
3. **流式支持不一致**：每个组件需要单独实现流式输出逻辑
4. **调试困难**：中间状态不透明，难以追踪数据流转
5. **代码冗长**：需要大量样板代码来连接各个组件

```python
# ❌ Legacy Chain 方式 - 冗长且难以维护
from langchain.chains import LLMChain

prompt = PromptTemplate(
    input_variables=["topic"],
    template="写一篇关于{topic}的简短文章。"
)

llm = ChatOpenAI(model="gpt-3.5-turbo")

chain = LLMChain(llm=llm, prompt=prompt)

# 执行
result = chain.run(topic="人工智能")
print(result)
```

### LCEL 的优势

LCEL 通过声明式语法解决了上述所有问题：

1. ✅ **类型推断**：自动推断组件之间的输入输出类型
2. ✅ **自动并行**：RunnableParallel 自动优化可并行的操作
3. ✅ **原生流式**：所有 Runnable 组件原生支持流式输出
4. ✅ **中间态追踪**：通过 astream_events 可查看完整的事件流
5. ✅ **简洁语法**：使用 pipe 操作符 `|` 构建直观的数据流

```python
# ✅ LCEL 方式 - 简洁且类型安全
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

prompt = ChatPromptTemplate.from_template("写一篇关于{topic}的简短文章。")
llm = ChatOpenAI(model="gpt-3.5-turbo")

# 使用 pipe 操作符组合
chain = prompt | llm

# 执行
result = chain.invoke({"topic": "人工智能"})
print(result.content)
```

## LCEL 核心设计哲学

LCEL 的设计遵循以下核心原则：

### 1. Runnable 协议

LCEL 的核心是 `Runnable` 接口，任何实现该接口的对象都可以：

- 接受输入并产生输出
- 支持同步和异步调用
- 支持流式和非流式输出
- 可以与其他 Runnable 组合

### 2. 声明式组合

使用 `|`（pipe）操作符将组件串联起来，形成清晰的数据流管道：

```python
# 声明式组合 - 数据从左向右流动
chain = prompt | llm | output_parser
```

这种组合方式类似于 Unix 管道的思想，每个组件都是一个独立的可组合单元。

### 3. 函数式编程

LCEL 借鉴了函数式编程的思想：

- **不可变性**：组合后的链不可修改，需要新链
- **纯函数**：Runnable 组件应该是确定性的
- **高阶函数**：可以将 Runnable 作为参数传递

## LCEL 核心语法：Pipe 操作符

Pipe 操作符 `|` 是 LCEL 的灵魂，它将多个 Runnable 连接成一个数据流管道。

### 基本语法

```python
from langchain_core.runnables import RunnableLambda

# 定义简单的转换函数
def add_one(x: int) -> int:
    return x + 1

def multiply_two(x: int) -> int:
    return x * 2

# 转换为 Runnable
add_oneRunnable = RunnableLambda(add_one)
multiply_two_runnable = RunnableLambda(multiply_two)

# 使用 pipe 组合
chain = add_one_runnable | multiply_two_runnable

# 执行：(3 + 1) * 2 = 8
result = chain.invoke(3)
print(result)  # 输出：8
```

### Pipe 操作符的工作原理

当使用 `|` 连接两个 Runnable 时：

1. 左侧 Runnable 的输出自动成为右侧 Runnable 的输入
2. 类型检查在组合时进行（如果可能）
3. 流式支持自动传递
4. 异步支持自动传递

```python
# pipe 的数据流示意图
# 输入 -> [Runnable A] -> 输出 A -> [Runnable B] -> 输出 B -> 最终结果
```

### 组合任意 Runnable

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

# 所有这些都是 Runnable，可以用 pipe 组合
prompt = ChatPromptTemplate.from_template("翻译以下内容为{language}:\n{content}")
llm = ChatOpenAI(model="gpt-3.5-turbo")
parser = StrOutputParser()

# 构建完整的数据流管道
translation_chain = prompt | llm | parser

# 调用
result = translation_chain.invoke({
    "language": "英语",
    "content": "你好，世界！"
})
print(result)  # Hello, World!
```

## 从简单到复杂的 LCEL 示例

### 示例 1：最简单的链

```python
from langchain_openai import ChatOpenAI

# 单个 LLM 也是一个 Runnable
llm = ChatOpenAI(model="gpt-3.5-turbo")

# 直接调用
response = llm.invoke("你好，请介绍一下自己。")
print(response.content)
```

### 示例 2：添加提示模板

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

# 定义模板
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个{role}助手。"),
    ("human", "{input}")
])

# 定义 LLM
llm = ChatOpenAI(model="gpt-3.5-turbo")

# 组合
chain = prompt | llm

# 调用时需要提供模板变量
response = chain.invoke({
    "role": "技术专家",
    "input": "什么是 LCEL？"
})
print(response.content)
```

### 示例 3：添加输出解析器

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

prompt = ChatPromptTemplate.from_template(
    "用一句话解释什么是{concept}。"
)

llm = ChatOpenAI(model="gpt-3.5-turbo")
parser = StrOutputParser()

# 三段式组合
chain = prompt | llm | parser

# 输出现在是字符串而不是 AIMessage
result = chain.invoke({"concept": "LCEL"})
print(f"类型：{type(result)}")  # <class 'str'>
print(result)
```

### 示例 4：并行处理

```python
from langchain_core.runnables import RunnableParallel
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-3.5-turbo")

# 并行执行多个独立调用
parallel_chain = RunnableParallel({
    "summary": llm | (lambda x: x.content[:100]),
    "title": llm | (lambda x: x.content.split("\n")[0]),
    "full": llm
})

result = parallel_chain.invoke("介绍人工智能")
print(result.keys())  # dict_keys(['summary', 'title', 'full'])
```

### 示例 5：复杂的生产级链

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnableLambda
from pydantic import BaseModel, Field

# 定义输出结构
class ArticleAnalysis(BaseModel):
    title: str = Field(description="文章标题")
    summary: str = Field(description="100 字以内的摘要")
    key_points: list[str] = Field(description="关键要点列表")
    sentiment: str = Field(description="情感倾向：正面/负面/中性")

# 构建复杂链
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个专业的内容分析助手。"),
    MessagesPlaceholder(variable_name="history", optional=True),
    ("human", "分析以下内容:\n{content}")
])

llm = ChatOpenAI(model="gpt-4-turbo")
parser = JsonOutputParser(pydantic_object=ArticleAnalysis)

# 添加后处理
def extract_insights(result: dict) -> dict:
    result['word_count'] = len(result['summary'].split())
    result['point_count'] = len(result['key_points'])
    return result

# 完整的处理管道
analysis_chain = (
    prompt
    | llm.bind(response_format={"type": "json_object"})
    | parser
    | RunnableLambda(extract_insights)
)

# 调用
result = analysis_chain.invoke({
    "content": "这是一篇关于 AI 发展的文章...",
    "history": []  # 可选的历史消息
})
```

## LCEL 与 Legacy Chain 对比

::: v-pre
```mermaid
flowchart TB
    subgraph Legacy["❌ Legacy Chain"]
        L1[PromptTemplate] --> L2[LLMChain]
        L2 --> L3[run<span style="color:red">()</span>]
        L3 --> L4[字符串输出]
        L5[需要手动处理]
        L6[类型不透明]
        L7[难以并行]
        
        style Legacy fill:#ffe6e6,stroke:#ff6666
    end
    
    subgraph LCEL["✅ LCEL"]
        R1[ChatPromptTemplate] --> R2[ChatModel]
        R2 --> R3[OutputParser]
        R3 --> R4["invoke<span style="color:green">()</span>/<br/>stream<span style="color:green">()</span>"]
        R4 --> R5[类型化输出]
        
        R2 -.-> R6[自动并行优化]
        R2 -.-> R7[原生流式支持]
        R2 -.-> R8[中间态追踪]
        
        style LCEL fill:#e6ffe6,stroke:#66ff66
    end
    
    Legacy -.->|升级 | LCEL
```
:::

上图展示了 Legacy Chain 与 LCEL 的核心差异：

| 维度 | Legacy Chain | LCEL |
|------|-------------|------|
| **组合方式** | 嵌套构造函数 | Pipe 操作符 `|` |
| **类型系统** | 动态/不透明 | 可推断/透明 |
| **流式支持** | 手动实现 | 原生支持 |
| **并行化** | 手动编写 | 自动优化 |
| **调试能力** | 有限 | astream_events |
| **代码简洁度** | 冗长 | 简洁 |
| **灵活性** | 受限 | 高度灵活 |

## 💡 提示块

> 💡 **最佳实践**
> 
> 1. **始终使用 LCEL**：新项目应该只使用 LCEL，Legacy Chain 已被标记为弃用
> 2. **保持组件单一职责**：每个 Runnable 应该只做一件事
> 3. **使用类型注解**：虽然 LCEL 可以推断类型，但显式注解有助于文档化
> 4. **优先使用异步**：在生产环境中使用 `ainvoke` 和 `astream` 获得更好的性能
> 5. **测试每个组件**：单独测试每个 Runnable，然后再测试组合后的链

## 总结

LCEL 是 LangChain 现代化的核心，它通过：

- 📐 **声明式语法**：使用 `|` 构建直观的数据流
- 🔒 **类型安全**：编译时类型检查（如果可能）
- ⚡ **性能优化**：自动并行和流式支持
- 🔍 **可调试性**：丰富的中间态追踪
- 🧩 **可组合性**：任何 Runnable 都可以与其他组合

掌握 LCEL 是学习 LangChain 的核心基础，后续的所有高级功能都建立在这个基础之上。