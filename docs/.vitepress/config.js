import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';

export default withMermaid({
  title: 'LangChain 全家桶学习指南',
  description: '从零到一掌握 LangChain 生态全链路，构建生产级 LLM 应用',

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '学习指南', link: '/guide/overview' },
      { text: 'LCEL', link: '/lcel/lcel-basics' },
      { text: 'LangGraph', link: '/langgraph/langgraph-basics' },
      { text: 'LangSmith', link: '/langsmith/langsmith-overview' },
      { text: 'LangServe', link: '/langserve/quick-deploy' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门指南',
          items: [
            { text: '概览', link: '/guide/overview' },
            { text: '快速开始', link: '/guide/quick-start' },
            { text: '核心概念', link: '/guide/core-concepts' },
            { text: '生态系统', link: '/guide/ecosystem' },
            { text: '学习路径', link: '/guide/learning-path' },
            { text: '术语表', link: '/guide/glossary' },
          ],
        },
      ],
      '/lcel/': [
        {
          text: 'LCEL 核心',
          items: [
            { text: '基础概念', link: '/lcel/lcel-basics' },
            { text: 'Runnable 接口', link: '/lcel/runnable-interface' },
            { text: '管道操作', link: '/lcel/pipeline' },
            { text: '并行分支', link: '/lcel/parallel-branch' },
            { text: '流式处理', link: '/lcel/streaming' },
            { text: '错误处理', link: '/lcel/error-handling' },
          ],
        },
      ],
      '/langgraph/': [
        {
          text: 'LangGraph',
          items: [
            { text: '基础概念', link: '/langgraph/langgraph-basics' },
            { text: '节点与边', link: '/langgraph/nodes-edges' },
            { text: '状态图', link: '/langgraph/state-graph' },
            { text: '条件路由', link: '/langgraph/conditional-routing' },
            { text: '人机交互', link: '/langgraph/human-in-loop' },
            { text: '持久化', link: '/langgraph/persistence' },
            { text: '子图', link: '/langgraph/subgraphs' },
            { text: '多智能体', link: '/langgraph/multi-agent' },
          ],
        },
      ],
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/xilin-code/langchain-learning-guide',
      },
    ],
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
});
