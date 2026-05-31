import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'LangChain 全家桶学习指南',
  description: '从零到一掌握 LangChain 生态全链路，构建生产级 LLM 应用',
  
  base: '/langchain-learning-guide/',
  
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/langchain-learning-guide/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }]
  ],
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '学习指南', link: '/guide/overview' },
      { text: 'LCEL', link: '/lcel/lcel-basics' },
      { text: 'LangGraph', link: '/langgraph/langgraph-basics' },
      { text: 'LangSmith', link: '/langsmith/langsmith-overview' },
      { text: 'LangServe', link: '/langserve/quick-deploy' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门篇',
          items: [
            { text: '为什么选择 LangChain', link: '/guide/why-langchain' },
            { text: '生态概览', link: '/guide/overview' },
            { text: '核心概念', link: '/guide/core-concepts' },
            { text: '学习路径', link: '/guide/learning-path' },
            { text: '快速开始', link: '/guide/quick-start' },
            { text: '生态词汇表', link: '/guide/glossary' }
          ]
        }
      ],
      
      '/lcel/': [
        {
          text: 'LCEL 核心语法',
          items: [
            { text: 'LCEL 基础', link: '/lcel/lcel-basics' },
            { text: 'Runnable 接口', link: '/lcel/runnable-interface' },
            { text: '管道操作', link: '/lcel/pipeline' },
            { text: '并行分支', link: '/lcel/parallel-branch' },
            { text: '流式处理', link: '/lcel/streaming' },
            { text: '错误处理', link: '/lcel/error-handling' }
          ]
        }
      ],
      
      '/model-io/': [
        {
          text: 'Model I/O',
          items: [
            { text: 'Chat Models', link: '/model-io/chat-models' },
            { text: 'LLMs', link: '/model-io/llms' },
            { text: 'Prompt Template', link: '/model-io/prompt-template' },
            { text: 'Output Parser', link: '/model-io/output-parser' },
            { text: 'Structured Output', link: '/model-io/structured-output' },
            { text: 'Tool Calling', link: '/model-io/tool-calling' }
          ]
        }
      ],
      
      '/rag/': [
        {
          text: 'RAG 系统',
          items: [
            { text: 'Document Loaders', link: '/rag/document-loaders' },
            { text: 'Text Splitters', link: '/rag/text-splitters' },
            { text: 'Embeddings', link: '/rag/embeddings' },
            { text: 'Vector Stores', link: '/rag/vector-stores' },
            { text: 'Retrievers', link: '/rag/retrievers' },
            { text: 'Parent-Document Retriever', link: '/rag/parent-doc-retriever' },
            { text: 'Multi-Vector Retriever', link: '/rag/multi-vector-retriever' },
            { text: 'RAG 最佳实践', link: '/rag/rag-best-practices' }
          ]
        }
      ],
      
      '/chains/': [
        {
          text: 'Chains',
          items: [
            { text: 'Chain 基础', link: '/chains/chain-basics' },
            { text: '迁移到 LCEL', link: '/chains/migrate-to-lcel' },
            { text: '顺序链', link: '/chains/sequential-chains' },
            { text: '路由链', link: '/chains/router-chain' }
          ]
        }
      ],
      
      '/agent/': [
        {
          text: 'Agents',
          items: [
            { text: 'Agent 概览', link: '/agent/agent-overview' },
            { text: 'ReAct Agent', link: '/agent/react-agent' },
            { text: 'LCEL Agent', link: '/agent/lcel-agent' },
            { text: 'Agent Executor', link: '/agent/agent-executor' },
            { text: '自定义工具', link: '/agent/custom-tools' },
            { text: '工具与工具包', link: '/agent/tools-toolkit' }
          ]
        }
      ],
      
      '/memory/': [
        {
          text: 'Memory',
          items: [
            { text: '对话记忆', link: '/memory/conversation-memory' },
            { text: '窗口记忆', link: '/memory/window-memory' },
            { text: '摘要记忆', link: '/memory/summary-memory' },
            { text: '向量记忆', link: '/memory/vector-memory' },
            { text: '迁移到 LCEL', link: '/memory/migrate-memory-lcel' }
          ]
        }
      ],
      
      '/callbacks/': [
        {
          text: 'Callbacks',
          items: [
            { text: '回调系统', link: '/callbacks/callback-system' },
            { text: '自定义处理器', link: '/callbacks/custom-handler' },
            { text: 'LangSmith 追踪', link: '/callbacks/langsmith-tracing' },
            { text: 'Langfuse', link: '/callbacks/langfuse' }
          ]
        }
      ],
      
      '/langsmith/': [
        {
          text: 'LangSmith',
          items: [
            { text: 'LangSmith 概览', link: '/langsmith/langsmith-overview' },
            { text: '追踪系统', link: '/langsmith/tracing' },
            { text: '数据集', link: '/langsmith/dataset' },
            { text: '评估系统', link: '/langsmith/evaluation' },
            { text: 'Prompt 管理', link: '/langsmith/prompt-management' }
          ]
        }
      ],
      
      '/langgraph/': [
        {
          text: 'LangGraph',
          items: [
            { text: 'LangGraph 基础', link: '/langgraph/langgraph-basics' },
            { text: '状态图', link: '/langgraph/state-graph' },
            { text: '节点与边', link: '/langgraph/nodes-edges' },
            { text: '条件路由', link: '/langgraph/conditional-routing' },
            { text: '子图', link: '/langgraph/subgraphs' },
            { text: '持久化', link: '/langgraph/persistence' },
            { text: '人机交互', link: '/langgraph/human-in-loop' },
            { text: '多智能体', link: '/langgraph/multi-agent' }
          ]
        }
      ],
      
      '/langserve/': [
        {
          text: 'LangServe',
          items: [
            { text: '快速部署', link: '/langserve/quick-deploy' },
            { text: 'API 设计', link: '/langserve/api-design' },
            { text: '流式输出', link: '/langserve/streaming-output' },
            { text: '认证与限流', link: '/langserve/auth-rate-limit' }
          ]
        }
      ],
      
      '/practice/': [
        {
          text: '项目实战',
          items: [
            { text: '项目概览', link: '/practice/project-summary' },
            { text: 'RAG Pipeline', link: '/practice/project-rag-pipeline' },
            { text: '问答 Bot', link: '/practice/project-qa-bot' },
            { text: '代码助手', link: '/practice/project-code-assistant' },
            { text: '多智能体系统', link: '/practice/project-multi-agent-system' }
          ]
        }
      ],
      
      '/interview/': [
        {
          text: '面试准备',
          items: [
            { text: 'LangChain 面试题', link: '/interview/langchain-questions' },
            { text: '系统设计', link: '/interview/system-design' },
            { text: '代码题', link: '/interview/coding-questions' },
            { text: '框架对比', link: '/interview/comparison' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/langchain-ai/langchain' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 LangChain 全家桶学习指南'
    }
  },
  
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "vitepress/theme/styles/vars.scss";`
        }
      }
    }
  },
  
  mermaid: {
    theme: 'default',
    themeVariables: {
      // 确保深色文字在浅色背景上
      primaryColor: '#ffffff',
      primaryTextColor: '#1e293b',
      primaryBorderColor: '#3b82f6',

      // Journey图配置
      taskBkgColor: '#ffffff',
      taskTextColor: '#1e293b',
      taskTextLightColor: '#1e293b',
      taskTextOutsideColor: '#1e293b',
      taskTextClickableColor: '#1e293b',

      // 背景和线条
      background: '#ffffff',
      lineColor: '#475569',
      sectionBkgColor: '#f8fafc',
      altSectionBkgColor: '#f1f5f9',

      // 网格和边框
      gridColor: '#cbd5e1',
      section0: '#e2e8f0',
      section1: '#f1f5f9',
      section2: '#f8fafc',
      section3: '#e2e8f0',

      // 确保文字可见
      textColor: '#1e293b',
      nodeTextColor: '#1e293b',
      clusterBkg: '#f8fafc',
      clusterBorder: '#cbd5e1',
    },
  },
})