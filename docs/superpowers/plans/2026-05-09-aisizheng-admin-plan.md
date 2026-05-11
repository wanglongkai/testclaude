# AI思政 管理平台 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从零搭建"AI思政"中后台管理系统，包含登录、仪表盘、4 大业务模块（14 个功能页）、数据监控大屏。

**Architecture:** React + Vite SPA，antd ProLayout 布局，react-router v6 路由，zustand 状态管理，axios API 层对接后端。骨架优先：先建基础设施（布局/路由/认证），再逐模块填充页面。

**Tech Stack:** React 19 + TypeScript + Vite + antd 5 + TailwindCSS v4 + react-router v6 + zustand + axios + echarts

---

## 文件结构总览

```
ai-sizheng-admin/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── vite.svg
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styles/
    │   └── index.css              # Tailwind v4 @theme 配置
    ├── types/
    │   └── index.ts               # 全局类型定义
    ├── utils/
    │   └── index.ts               # 工具函数
    ├── api/
    │   ├── request.ts             # axios 实例 + 拦截器
    │   └── services/
    │       ├── auth.ts            # 登录 API
    │       ├── dashboard.ts       # 仪表盘 API
    │       ├── knowledge.ts       # 知识库 API
    │       ├── ranking.ts         # 锋云榜 API
    │       ├── party.ts           # 党小组 API
    │       └── system.ts          # 系统管理 API
    ├── stores/
    │   ├── authStore.ts           # 认证状态
    │   └── appStore.ts            # 全局 UI 状态
    ├── router/
    │   ├── index.tsx              # 路由配置
    │   └── AuthGuard.tsx          # 路由守卫
    ├── layouts/
    │   ├── MainLayout.tsx         # 主布局（侧边栏 + 顶栏 + 内容）
    │   ├── Sidebar.tsx
    │   └── Header.tsx
    ├── components/
    │   ├── PageHeader.tsx         # 页面标题栏
    │   ├── SearchForm.tsx         # 通用搜索表单
    │   └── DataTable.tsx          # 通用表格封装
    └── pages/
        ├── login/
        │   └── index.tsx
        ├── dashboard/
        │   └── index.tsx
        ├── knowledge/
        │   ├── resources.tsx
        │   └── recommend.tsx
        ├── ranking/
        │   ├── categories.tsx
        │   ├── submissions.tsx
        │   └── style.tsx
        ├── party/
        │   ├── structure.tsx
        │   ├── members.tsx
        │   └── transfers.tsx
        └── system/
            ├── permissions.tsx
            ├── notifications.tsx
            ├── backup.tsx
            ├── monitor.tsx
            ├── logs.tsx
            ├── dictionary.tsx
            └── params.tsx
```

---

### Phase 1: 项目脚手架

---

### Task 1: 初始化项目

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`, `src/styles/index.css`, `public/vite.svg`

- [ ] **Step 1: 使用 Vite 创建项目**

Run: `npm create vite@latest ai-sizheng-admin -- --template react-ts`
Then: `cd ai-sizheng-admin && npm install`

- [ ] **Step 2: 安装依赖**

Run:
```bash
npm install antd @ant-design/icons @ant-design/pro-layout react-router-dom zustand axios echarts echarts-for-react
npm install -D @types/node tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: 配置 vite.config.ts**

Write `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

- [ ] **Step 4: 配置 tsconfig.app.json 添加路径别名**

Modify `tsconfig.app.json` — 在 `compilerOptions` 中添加:

```json
"baseUrl": ".",
"paths": {
  "@/*": ["./src/*"]
}
```

- [ ] **Step 5: 配置 TailwindCSS v4**

Write `src/styles/index.css`:

```css
@import "tailwindcss";

@theme {
  --color-primary: #1677ff;
  --color-primary-light: #4096ff;
  --color-accent: #e74c3c;
  --color-sidebar: #001529;
  --color-bg: #f0f2f5;
}
```

- [ ] **Step 6: 清理默认模板**

Write `src/App.tsx`:

```tsx
import { BrowserRouter } from 'react-router-dom'

function App() {
  return <BrowserRouter>App</BrowserRouter>
}

export default App
```

Write `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Write `index.html` (ensure it has `<div id="root"></div>` and references `/src/main.tsx`):

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI思政 - 智能思想政治教育管理平台</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: 验证项目启动**

Run: `npx vite --host`
Expected: 浏览器打开 localhost:3000，页面显示 "App"

---

### Phase 2: 核心基础设施

---

### Task 2: 全局类型定义

**Files:**
- Create: `src/types/index.ts`
- Create: `src/utils/index.ts`

- [ ] **Step 1: 定义全局类型**

Write `src/types/index.ts`:

```typescript
// 通用分页请求
export interface PageParams {
  page: number
  pageSize: number
}

// 通用分页响应
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 通用 API 响应
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

// 用户信息
export interface UserInfo {
  id: string
  username: string
  name: string
  avatar?: string
  role: 'admin' | 'editor' | 'viewer'
}

// 登录请求/响应
export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  user: UserInfo
}

// 侧边栏菜单项
export interface MenuItem {
  key: string
  label: string
  icon?: React.ReactNode
  children?: MenuItem[]
}
```

- [ ] **Step 2: 定义工具函数**

Write `src/utils/index.ts`:

```typescript
export function getToken(): string | null {
  return localStorage.getItem('token')
}

export function setToken(token: string): void {
  localStorage.setItem('token', token)
}

export function removeToken(): void {
  localStorage.removeItem('token')
}

export function getUserInfo(): Record<string, unknown> | null {
  const raw = localStorage.getItem('userInfo')
  return raw ? JSON.parse(raw) : null
}

export function setUserInfo(user: Record<string, unknown>): void {
  localStorage.setItem('userInfo', JSON.stringify(user))
}

export function removeUserInfo(): void {
  localStorage.removeItem('userInfo')
}
```

---

### Task 3: API 请求层

**Files:**
- Create: `src/api/request.ts`

- [ ] **Step 1: 创建 axios 实例 + 拦截器**

Write `src/api/request.ts`:

```typescript
import axios from 'axios'
import { message } from 'antd'
import { getToken, removeToken, removeUserInfo } from '@/utils'

const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

// 请求拦截器: 自动注入 token
request.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器: 统一错误处理
request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code !== 0 && data.code !== 200) {
      message.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }
    return data
  },
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }
    if (error.response?.status === 401) {
      removeToken()
      removeUserInfo()
      window.location.href = '/login'
      message.error('登录已过期，请重新登录')
      return Promise.reject(error)
    }
    message.error(error.message || '网络错误')
    return Promise.reject(error)
  },
)

export default request
```

---

### Task 4: Zustand Stores

**Files:**
- Create: `src/stores/authStore.ts`
- Create: `src/stores/appStore.ts`

- [ ] **Step 1: 认证 Store**

Write `src/stores/authStore.ts`:

```typescript
import { create } from 'zustand'
import { setToken, removeToken, setUserInfo, removeUserInfo, getToken, getUserInfo } from '@/utils'
import type { UserInfo, LoginParams } from '@/types'
import { login as loginApi } from '@/api/services/auth'

interface AuthState {
  token: string | null
  userInfo: UserInfo | null
  login: (params: LoginParams) => Promise<void>
  logout: () => void
  loadFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: getToken(),
  userInfo: getUserInfo() as UserInfo | null,

  login: async (params: LoginParams) => {
    const res = await loginApi(params)
    const { token, user } = res.data
    setToken(token)
    setUserInfo(user)
    set({ token, userInfo: user })
  },

  logout: () => {
    removeToken()
    removeUserInfo()
    set({ token: null, userInfo: null })
  },

  loadFromStorage: () => {
    set({
      token: getToken(),
      userInfo: getUserInfo() as UserInfo | null,
    })
  },
}))
```

- [ ] **Step 2: 全局 UI Store**

Write `src/stores/appStore.ts`:

```typescript
import { create } from 'zustand'

interface AppState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}))
```

---

### Task 5: 路由配置 & 守卫

**Files:**
- Create: `src/router/AuthGuard.tsx`
- Create: `src/router/index.tsx`

- [ ] **Step 1: 路由守卫**

Write `src/router/AuthGuard.tsx`:

```tsx
import { Navigate, useLocation } from 'react-router-dom'
import { getToken } from '@/utils'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const token = getToken()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
```

- [ ] **Step 2: 路由常量 & 路由表**

Write `src/router/index.tsx`:

```tsx
import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import AuthGuard from './AuthGuard'
import LoginPage from '@/pages/login'
import DashboardPage from '@/pages/dashboard'

// 懒加载页面
import { lazy, Suspense } from 'react'
import { Spin } from 'antd'

function LazyPage({ Page }: { Page: React.LazyExoticComponent<() => JSX.Element> }) {
  return (
    <Suspense fallback={<Spin style={{ display: 'block', marginTop: 100 }} />}>
      <Page />
    </Suspense>
  )
}

const ResourcesPage = lazy(() => import('@/pages/knowledge/resources'))
const RecommendPage = lazy(() => import('@/pages/knowledge/recommend'))
const CategoriesPage = lazy(() => import('@/pages/ranking/categories'))
const SubmissionsPage = lazy(() => import('@/pages/ranking/submissions'))
const StylePage = lazy(() => import('@/pages/ranking/style'))
const StructurePage = lazy(() => import('@/pages/party/structure'))
const MembersPage = lazy(() => import('@/pages/party/members'))
const TransfersPage = lazy(() => import('@/pages/party/transfers'))
const PermissionsPage = lazy(() => import('@/pages/system/permissions'))
const NotificationsPage = lazy(() => import('@/pages/system/notifications'))
const BackupPage = lazy(() => import('@/pages/system/backup'))
const MonitorPage = lazy(() => import('@/pages/system/monitor'))
const LogsPage = lazy(() => import('@/pages/system/logs'))
const DictionaryPage = lazy(() => import('@/pages/system/dictionary'))
const ParamsPage = lazy(() => import('@/pages/system/params'))

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'knowledge/resources', element: <LazyPage Page={ResourcesPage} /> },
      { path: 'knowledge/recommend', element: <LazyPage Page={RecommendPage} /> },
      { path: 'ranking/categories', element: <LazyPage Page={CategoriesPage} /> },
      { path: 'ranking/submissions', element: <LazyPage Page={SubmissionsPage} /> },
      { path: 'ranking/style', element: <LazyPage Page={StylePage} /> },
      { path: 'party/structure', element: <LazyPage Page={StructurePage} /> },
      { path: 'party/members', element: <LazyPage Page={MembersPage} /> },
      { path: 'party/transfers', element: <LazyPage Page={TransfersPage} /> },
      { path: 'system/permissions', element: <LazyPage Page={PermissionsPage} /> },
      { path: 'system/notifications', element: <LazyPage Page={NotificationsPage} /> },
      { path: 'system/backup', element: <LazyPage Page={BackupPage} /> },
      { path: 'system/monitor', element: <LazyPage Page={MonitorPage} /> },
      { path: 'system/logs', element: <LazyPage Page={LogsPage} /> },
      { path: 'system/dictionary', element: <LazyPage Page={DictionaryPage} /> },
      { path: 'system/params', element: <LazyPage Page={ParamsPage} /> },
    ],
  },
])
```

- [ ] **Step 3: 更新 App.tsx 接入路由**

Write `src/App.tsx`:

```tsx
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}

export default App
```

---

### Phase 3: 布局框架

---

### Task 6: 侧边栏

**Files:**
- Create: `src/layouts/Sidebar.tsx`

- [ ] **Step 1: 侧边栏组件**

Write `src/layouts/Sidebar.tsx`:

```tsx
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu } from 'antd'
import {
  DashboardOutlined,
  BookOutlined,
  TrophyOutlined,
  TeamOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

const menuItems: MenuProps['items'] = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: 'knowledge',
    icon: <BookOutlined />,
    label: '知识库管理',
    children: [
      { key: '/knowledge/resources', label: '多模态资源维护' },
      { key: '/knowledge/recommend', label: '知识检索与推荐配置' },
    ],
  },
  {
    key: 'ranking',
    icon: <TrophyOutlined />,
    label: '锋云榜管理',
    children: [
      { key: '/ranking/categories', label: '榜单分类管理' },
      { key: '/ranking/submissions', label: '作品投稿管理' },
      { key: '/ranking/style', label: '配置个人风采内容' },
    ],
  },
  {
    key: 'party',
    icon: <TeamOutlined />,
    label: '党小组及成员管理',
    children: [
      { key: '/party/structure', label: '党小组组织架构管理' },
      { key: '/party/members', label: '成员信息管理' },
      { key: '/party/transfers', label: '成员调动与归属调整' },
    ],
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    label: '系统管理',
    children: [
      { key: '/system/permissions', label: '用户权限管理' },
      { key: '/system/notifications', label: '消息通知配置' },
      { key: '/system/backup', label: '数据备份与恢复' },
      { key: '/system/monitor', label: '数据监控大屏' },
      { key: '/system/logs', label: '日志管理' },
      { key: '/system/dictionary', label: '数据字典管理' },
      { key: '/system/params', label: '系统参数配置' },
    ],
  },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  // 计算当前展开和选中的菜单项
  const selectedKey = location.pathname
  const openKeys = location.pathname.split('/').filter(Boolean).length > 1
    ? ['/' + location.pathname.split('/')[1]]
    : []

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div
        style={{
          height: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 18,
          fontWeight: 700,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <span style={{ color: '#1677ff' }}>AI</span>
        <span style={{ color: '#e74c3c' }}>思政</span>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={openKeys}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </div>
  )
}
```

---

### Task 7: 顶栏 & 主布局

**Files:**
- Create: `src/layouts/Header.tsx`
- Create: `src/layouts/MainLayout.tsx`

- [ ] **Step 1: 顶栏**

Write `src/layouts/Header.tsx`:

```tsx
import { Layout, Dropdown, Badge } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'

const { Header: AntHeader } = Layout

export default function Header() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore()
  const { userInfo, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const userMenuItems = [
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: handleLogout },
  ]

  return (
    <AntHeader
      style={{
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0',
        height: 52,
        lineHeight: '52px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span onClick={toggleSidebar} style={{ cursor: 'pointer', fontSize: 18 }}>
          {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </span>
        <span style={{ fontSize: 13, color: '#999' }}>智能思想政治教育管理平台</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <Badge count={5} size="small">
          <BellOutlined style={{ fontSize: 18, color: '#666', cursor: 'pointer' }} />
        </Badge>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#1677ff',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
              }}
            >
              <UserOutlined />
            </div>
            <span style={{ fontSize: 13, color: '#333' }}>{userInfo?.name || '管理员'}</span>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  )
}
```

- [ ] **Step 2: 主布局**

Write `src/layouts/MainLayout.tsx`:

```tsx
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useAppStore } from '@/stores/appStore'

const { Sider, Content } = Layout

export default function MainLayout() {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        width={220}
        style={{
          background: '#001529',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Sidebar />
      </Sider>
      <Layout>
        <Header />
        <Content
          style={{
            margin: 16,
            padding: 24,
            background: '#fff',
            borderRadius: 6,
            minHeight: 'calc(100vh - 52px - 32px)',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
```

---

### Phase 4: 登录页

---

### Task 8: 登录 API + 登录页

**Files:**
- Create: `src/api/services/auth.ts`
- Create: `src/pages/login/index.tsx`

- [ ] **Step 1: 登录 API**

Write `src/api/services/auth.ts`:

```typescript
import request from '../request'
import type { ApiResponse, LoginParams, LoginResult } from '@/types'

export function login(params: LoginParams): Promise<ApiResponse<LoginResult>> {
  return request.post('/auth/login', params)
}
```

- [ ] **Step 2: 登录页**

Write `src/pages/login/index.tsx`:

```tsx
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import type { LoginParams } from '@/types'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [form] = Form.useForm()

  const onFinish = async (values: LoginParams) => {
    try {
      await login(values)
      message.success('登录成功')
      navigate('/', { replace: true })
    } catch {
      // 错误已在 request 拦截器中处理
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1677ff 0%, #001529 100%)',
      }}
    >
      <Card
        style={{ width: 400, borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
        styles={{ body: { padding: '40px 32px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, margin: 0 }}>
            <span style={{ color: '#1677ff' }}>AI</span>
            <span style={{ color: '#e74c3c' }}>思政</span>
          </h1>
          <p style={{ color: '#999', marginTop: 8, fontSize: 14 }}>
            智能思想政治教育管理平台
          </p>
        </div>
        <Form
          form={form}
          onFinish={onFinish}
          size="large"
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block>
              登 录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
```

- [ ] **Step 3: 验证登录流程**

Run: `npx vite --host`
Expected: 打开 localhost:3000，自动跳转 `/login`，显示登录页

---

### Phase 5: 仪表盘

---

### Task 9: 仪表盘页

**Files:**
- Create: `src/api/services/dashboard.ts`
- Create: `src/pages/dashboard/index.tsx`

- [ ] **Step 1: 仪表盘 API**

Write `src/api/services/dashboard.ts`:

```typescript
import request from '../request'
import type { ApiResponse } from '@/types'

export interface DashboardStats {
  knowledgeCount: number
  rankingCount: number
  memberCount: number
  logCount: number
}

export function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return request.get('/dashboard/stats')
}
```

- [ ] **Step 2: 仪表盘页**

Write `src/pages/dashboard/index.tsx`:

```tsx
import { Card, Col, Row, Statistic } from 'antd'
import {
  BookOutlined,
  TrophyOutlined,
  TeamOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { getDashboardStats, type DashboardStats } from '@/api/services/dashboard'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    knowledgeCount: 0,
    rankingCount: 0,
    memberCount: 0,
    logCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { title: '知识资源总数', value: stats.knowledgeCount, icon: <BookOutlined />, color: '#1677ff', bg: '#f0f5ff' },
    { title: '锋云榜作品', value: stats.rankingCount, icon: <TrophyOutlined />, color: '#52c41a', bg: '#f6ffed' },
    { title: '党小组成员', value: stats.memberCount, icon: <TeamOutlined />, color: '#fa8c16', bg: '#fff7e6' },
    { title: '系统日志', value: stats.logCount, icon: <FileTextOutlined />, color: '#e74c3c', bg: '#fff1f0' },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>仪表盘</h2>
      <Row gutter={[16, 16]}>
        {cards.map((card) => (
          <Col xs={24} sm={12} lg={6} key={card.title}>
            <Card loading={loading} style={{ borderRadius: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: card.bg,
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                  }}
                >
                  {card.icon}
                </div>
                <Statistic title={card.title} value={card.value} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={{ marginTop: 24, borderRadius: 6 }}>
        <h3 style={{ marginBottom: 16 }}>👋 欢迎回来</h3>
        <p style={{ color: '#999' }}>
          AI思政智能管理平台，提供知识库管理、锋云榜管理、党小组管理及系统管理等功能。
        </p>
      </Card>
    </div>
  )
}
```

- [ ] **Step 3: 验证仪表盘**

Run: `npx vite --host`
Expected: 登录后跳转首页，显示 4 张统计卡片

---

### Phase 6: 公共组件

---

### Task 10: 公共组件

**Files:**
- Create: `src/components/PageHeader.tsx`
- Create: `src/components/SearchForm.tsx`
- Create: `src/components/DataTable.tsx`

- [ ] **Step 1: 页面标题栏组件**

Write `src/components/PageHeader.tsx`:

```tsx
import { Button } from 'antd'

export interface PageHeaderAction {
  label: string
  type?: 'primary' | 'default'
  icon?: React.ReactNode
  onClick: () => void
}

interface PageHeaderProps {
  title: string
  actions?: PageHeaderAction[]
}

export default function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
      }}
    >
      <h2 style={{ margin: 0 }}>{title}</h2>
      {actions && actions.length > 0 && (
        <div style={{ display: 'flex', gap: 8 }}>
          {actions.map((action, i) => (
            <Button
              key={i}
              type={action.type === 'primary' ? 'primary' : 'default'}
              icon={action.icon}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 通用搜索表单**

Write `src/components/SearchForm.tsx`:

```tsx
import { Form, Input, Select, Button } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'

export type SearchFieldType = 'input' | 'select'

export interface SearchField {
  name: string
  label: string
  type: SearchFieldType
  placeholder?: string
  options?: { label: string; value: string | number }[]
}

interface SearchFormProps {
  fields: SearchField[]
  onSearch: (values: Record<string, unknown>) => void
  onReset?: () => void
}

export default function SearchForm({ fields, onSearch, onReset }: SearchFormProps) {
  const [form] = Form.useForm()

  const handleReset = () => {
    form.resetFields()
    onReset?.()
  }

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={onSearch}
      style={{ marginBottom: 16, flexWrap: 'wrap', gap: 8 }}
    >
      {fields.map((field) => (
        <Form.Item key={field.name} name={field.name} label={field.label} style={{ marginBottom: 8 }}>
          {field.type === 'select' ? (
            <Select
              placeholder={field.placeholder || '请选择'}
              options={field.options}
              allowClear
              style={{ width: 160 }}
            />
          ) : (
            <Input placeholder={field.placeholder || '请输入'} allowClear style={{ width: 160 }} />
          )}
        </Form.Item>
      ))}
      <Form.Item style={{ marginBottom: 8 }}>
        <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
          搜索
        </Button>
      </Form.Item>
      <Form.Item style={{ marginBottom: 8 }}>
        <Button onClick={handleReset} icon={<ReloadOutlined />}>
          重置
        </Button>
      </Form.Item>
    </Form>
  )
}
```

- [ ] **Step 3: 通用表格封装**

Write `src/components/DataTable.tsx`:

```tsx
import { Table } from 'antd'
import type { TablePaginationConfig, TableProps } from 'antd'
import { useState, useEffect, useCallback } from 'react'

interface DataTableProps<T> {
  columns: TableProps<T>['columns']
  fetchData: (params: { page: number; pageSize: number }) => Promise<{ list: T[]; total: number }>
  rowKey?: string | ((record: T) => string)
  refreshFlag?: number // 外部修改此值触发刷新
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  fetchData,
  rowKey = 'id',
  refreshFlag = 0,
}: DataTableProps<T>) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchData({
        page: pagination.current,
        pageSize: pagination.pageSize,
      })
      setData(res.list)
      setPagination((prev) => ({ ...prev, total: res.total }))
    } catch {
      // 错误已在拦截器处理
    } finally {
      setLoading(false)
    }
  }, [fetchData, pagination.current, pagination.pageSize])

  useEffect(() => {
    loadData()
  }, [loadData, refreshFlag])

  const handleTableChange = (pag: TablePaginationConfig) => {
    setPagination((prev) => ({
      ...prev,
      current: pag.current || 1,
      pageSize: pag.pageSize || 10,
    }))
  }

  return (
    <Table<T>
      columns={columns}
      dataSource={data}
      rowKey={rowKey}
      loading={loading}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
      }}
      onChange={handleTableChange}
      scroll={{ x: 'max-content' }}
    />
  )
}
```

---

### Phase 7: 业务模块页面

每个模块页面遵循统一模式:
1. 创建 API service 函数（`src/api/services/<module>.ts`）
2. 创建页面组件（`src/pages/<module>/<page>.tsx`）

---

### Task 11: 知识库管理模块

**Files:**
- Create: `src/api/services/knowledge.ts`
- Create: `src/pages/knowledge/resources.tsx`
- Create: `src/pages/knowledge/recommend.tsx`

- [ ] **Step 1: 知识库 API**

Write `src/api/services/knowledge.ts`:

```typescript
import request from '../request'
import type { ApiResponse, PageResult } from '@/types'

export interface KnowledgeResource {
  id: string
  title: string
  type: 'document' | 'video' | 'image' | 'audio'
  category: string
  author: string
  status: 'published' | 'draft' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface KnowledgeSearchParams {
  page: number
  pageSize: number
  keyword?: string
  type?: string
  status?: string
}

export function getResources(params: KnowledgeSearchParams): Promise<ApiResponse<PageResult<KnowledgeResource>>> {
  return request.get('/knowledge/resources', { params })
}

export function createResource(data: Partial<KnowledgeResource>): Promise<ApiResponse<KnowledgeResource>> {
  return request.post('/knowledge/resources', data)
}

export function updateResource(id: string, data: Partial<KnowledgeResource>): Promise<ApiResponse<KnowledgeResource>> {
  return request.put(`/knowledge/resources/${id}`, data)
}

export function deleteResource(id: string): Promise<ApiResponse<null>> {
  return request.delete(`/knowledge/resources/${id}`)
}
```

- [ ] **Step 2: 多模态资源维护页**

Write `src/pages/knowledge/resources.tsx`:

```tsx
import { useState } from 'react'
import { Tag, Modal, Form, Input, Select, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import SearchForm, { type SearchField } from '@/components/SearchForm'
import DataTable from '@/components/DataTable'
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
  type KnowledgeResource,
  type KnowledgeSearchParams,
} from '@/api/services/knowledge'
import type { ColumnsType } from 'antd/es/table'

const typeOptions = [
  { label: '文档', value: 'document' },
  { label: '视频', value: 'video' },
  { label: '图片', value: 'image' },
  { label: '音频', value: 'audio' },
]

const statusOptions = [
  { label: '已发布', value: 'published' },
  { label: '草稿', value: 'draft' },
  { label: '已归档', value: 'archived' },
]

export default function ResourcesPage() {
  const [searchParams, setSearchParams] = useState<Record<string, unknown>>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<KnowledgeResource | null>(null)
  const [refresh, setRefresh] = useState(0)
  const [form] = Form.useForm()

  const searchFields: SearchField[] = [
    { name: 'keyword', label: '关键词', type: 'input', placeholder: '搜索标题' },
    { name: 'type', label: '资源类型', type: 'select', options: typeOptions },
    { name: 'status', label: '状态', type: 'select', options: statusOptions },
  ]

  const columns: ColumnsType<KnowledgeResource> = [
    { title: '标题', dataIndex: 'title', key: 'title', width: 200, ellipsis: true },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const map: Record<string, { color: string; label: string }> = {
          document: { color: 'blue', label: '文档' },
          video: { color: 'purple', label: '视频' },
          image: { color: 'green', label: '图片' },
          audio: { color: 'orange', label: '音频' },
        }
        return <Tag color={map[type]?.color}>{map[type]?.label || type}</Tag>
      },
    },
    { title: '分类', dataIndex: 'category', key: 'category', width: 120 },
    { title: '作者', dataIndex: 'author', key: 'author', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const map: Record<string, { color: string; label: string }> = {
          published: { color: 'green', label: '已发布' },
          draft: { color: 'default', label: '草稿' },
          archived: { color: 'red', label: '已归档' },
        }
        return <Tag color={map[status]?.color}>{map[status]?.label || status}</Tag>
      },
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a style={{ color: '#e74c3c' }} onClick={() => handleDelete(record.id)}>删除</a>
        </div>
      ),
    },
  ]

  const fetchData = (params: { page: number; pageSize: number }) => {
    return getResources({ ...params, ...searchParams } as KnowledgeSearchParams).then((res) => res.data)
  }

  const handleSearch = (values: Record<string, unknown>) => {
    setSearchParams(values)
    setRefresh((r) => r + 1)
  }

  const handleReset = () => {
    setSearchParams({})
    setRefresh((r) => r + 1)
  }

  const handleAdd = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const handleEdit = (record: KnowledgeResource) => {
    setEditing(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后不可恢复，确定删除该资源吗？',
      onOk: async () => {
        await deleteResource(id)
        message.success('删除成功')
        setRefresh((r) => r + 1)
      },
    })
  }

  const handleModalOk = async () => {
    const values = await form.validateFields()
    if (editing) {
      await updateResource(editing.id, values)
      message.success('更新成功')
    } else {
      await createResource(values)
      message.success('创建成功')
    }
    setModalOpen(false)
    setRefresh((r) => r + 1)
  }

  return (
    <div>
      <PageHeader title="多模态资源维护" actions={[{ label: '新增资源', type: 'primary', icon: <PlusOutlined />, onClick: handleAdd }]} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable<KnowledgeResource> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} />
      <Modal
        title={editing ? '编辑资源' : '新增资源'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        width={520}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="资源类型" rules={[{ required: true, message: '请选择类型' }]}>
            <Select options={typeOptions} />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true, message: '请输入分类' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="author" label="作者">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select options={statusOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
```

- [ ] **Step 3: 知识检索与推荐配置页**

Write `src/pages/knowledge/recommend.tsx`:

```tsx
import { Card, Form, InputNumber, Select, Switch, Button, message } from 'antd'
import PageHeader from '@/components/PageHeader'

export default function RecommendPage() {
  const [form] = Form.useForm()

  const handleSave = async () => {
    const values = await form.validateFields()
    console.log('保存配置:', values)
    message.success('配置已保存')
  }

  return (
    <div>
      <PageHeader title="知识检索与推荐配置" actions={[{ label: '保存配置', type: 'primary', onClick: handleSave }]} />
      <Card style={{ maxWidth: 640 }}>
        <Form form={form} layout="vertical" initialValues={{ recallSize: 20, enableRecommend: true }}>
          <Form.Item name="enableRecommend" label="启用智能推荐" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="recallSize" label="检索召回数量">
            <InputNumber min={5} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="embedModel" label="嵌入模型">
            <Select
              options={[
                { label: 'text-embedding-v1', value: 'text-embedding-v1' },
                { label: 'text-embedding-v2', value: 'text-embedding-v2' },
              ]}
            />
          </Form.Item>
          <Form.Item name="rerankMode" label="重排序模式">
            <Select
              options={[
                { label: '语义相关性', value: 'semantic' },
                { label: '时间优先', value: 'time' },
                { label: '热度优先', value: 'hot' },
              ]}
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
```

---

### Task 12: 锋云榜管理模块

**Files:**
- Create: `src/api/services/ranking.ts`
- Create: `src/pages/ranking/categories.tsx`
- Create: `src/pages/ranking/submissions.tsx`
- Create: `src/pages/ranking/style.tsx`

- [ ] **Step 1: 锋云榜 API**

Write `src/api/services/ranking.ts`:

```typescript
import request from '../request'
import type { ApiResponse, PageResult } from '@/types'

export interface RankingCategory {
  id: string
  name: string
  order: number
  status: 'active' | 'inactive'
  description?: string
  createdAt: string
}

export interface Submission {
  id: string
  title: string
  author: string
  categoryId: string
  categoryName: string
  status: 'pending' | 'approved' | 'rejected'
  voteCount: number
  submittedAt: string
}

export interface StyleContent {
  id: string
  userId: string
  userName: string
  content: string
  imageUrl?: string
  status: 'published' | 'draft'
  updatedAt: string
}

// 分类管理 API
export function getCategories(params: { page: number; pageSize: number }): Promise<ApiResponse<PageResult<RankingCategory>>> {
  return request.get('/ranking/categories', { params })
}

export function createCategory(data: Partial<RankingCategory>): Promise<ApiResponse<RankingCategory>> {
  return request.post('/ranking/categories', data)
}

export function updateCategory(id: string, data: Partial<RankingCategory>): Promise<ApiResponse<RankingCategory>> {
  return request.put(`/ranking/categories/${id}`, data)
}

export function deleteCategory(id: string): Promise<ApiResponse<null>> {
  return request.delete(`/ranking/categories/${id}`)
}

// 作品投稿 API
export function getSubmissions(params: { page: number; pageSize: number; keyword?: string; status?: string }): Promise<ApiResponse<PageResult<Submission>>> {
  return request.get('/ranking/submissions', { params })
}

export function approveSubmission(id: string): Promise<ApiResponse<Submission>> {
  return request.put(`/ranking/submissions/${id}/approve`)
}

export function rejectSubmission(id: string): Promise<ApiResponse<Submission>> {
  return request.put(`/ranking/submissions/${id}/reject`)
}

// 个人风采 API
export function getStyleContents(params: { page: number; pageSize: number }): Promise<ApiResponse<PageResult<StyleContent>>> {
  return request.get('/ranking/style', { params })
}

export function updateStyleContent(id: string, data: Partial<StyleContent>): Promise<ApiResponse<StyleContent>> {
  return request.put(`/ranking/style/${id}`, data)
}
```

- [ ] **Step 2: 榜单分类管理页**

Write `src/pages/ranking/categories.tsx`:

```tsx
import { useState } from 'react'
import { Tag, Modal, Form, Input, InputNumber, Select, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import SearchForm, { type SearchField } from '@/components/SearchForm'
import DataTable from '@/components/DataTable'
import { getCategories, createCategory, updateCategory, deleteCategory, type RankingCategory } from '@/api/services/ranking'
import type { ColumnsType } from 'antd/es/table'

export default function CategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<RankingCategory | null>(null)
  const [refresh, setRefresh] = useState(0)
  const [form] = Form.useForm()

  const searchFields: SearchField[] = [
    { name: 'keyword', label: '名称', type: 'input' },
  ]

  const columns: ColumnsType<RankingCategory> = [
    { title: '排序', dataIndex: 'order', key: 'order', width: 80 },
    { title: '分类名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '描述', dataIndex: 'description', key: 'description', width: 300, ellipsis: true },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s === 'active' ? '启用' : '禁用'}</Tag>,
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
    {
      title: '操作', key: 'action', width: 160,
      render: (_, r) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <a onClick={() => { setEditing(r); form.setFieldsValue(r); setModalOpen(true) }}>编辑</a>
          <a style={{ color: '#e74c3c' }} onClick={() => {
            Modal.confirm({ title: '确认删除', content: '确定删除该分类吗？', onOk: async () => { await deleteCategory(r.id); message.success('已删除'); setRefresh(x => x + 1) } })
          }}>删除</a>
        </div>
      ),
    },
  ]

  const fetchData = (params: { page: number; pageSize: number }) => getCategories(params).then(r => r.data)

  const handleAdd = () => { setEditing(null); form.resetFields(); setModalOpen(true) }

  const handleModalOk = async () => {
    const values = await form.validateFields()
    if (editing) { await updateCategory(editing.id, values); message.success('更新成功') }
    else { await createCategory(values); message.success('创建成功') }
    setModalOpen(false)
    setRefresh(x => x + 1)
  }

  return (
    <div>
      <PageHeader title="榜单分类管理" actions={[{ label: '新增分类', type: 'primary', icon: <PlusOutlined />, onClick: handleAdd }]} />
      <SearchForm fields={searchFields} onSearch={() => setRefresh(x => x + 1)} onReset={() => setRefresh(x => x + 1)} />
      <DataTable<RankingCategory> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} />
      <Modal title={editing ? '编辑分类' : '新增分类'} open={modalOpen} onOk={handleModalOk} onCancel={() => setModalOpen(false)}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="分类名称" rules={[{ required: true, message: '请输入' }]}><Input /></Form.Item>
          <Form.Item name="order" label="排序" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="description" label="描述"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select options={[{ label: '启用', value: 'active' }, { label: '禁用', value: 'inactive' }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
```

- [ ] **Step 3: 作品投稿管理页**

Write `src/pages/ranking/submissions.tsx`:

```tsx
import { useState } from 'react'
import { Tag, Modal, message } from 'antd'
import PageHeader from '@/components/PageHeader'
import SearchForm, { type SearchField } from '@/components/SearchForm'
import DataTable from '@/components/DataTable'
import { getSubmissions, approveSubmission, rejectSubmission, type Submission } from '@/api/services/ranking'
import type { ColumnsType } from 'antd/es/table'

export default function SubmissionsPage() {
  const [refresh, setRefresh] = useState(0)

  const searchFields: SearchField[] = [
    { name: 'keyword', label: '标题/作者', type: 'input' },
    { name: 'status', label: '状态', type: 'select', options: [
      { label: '待审核', value: 'pending' }, { label: '已通过', value: 'approved' }, { label: '已驳回', value: 'rejected' },
    ] },
  ]

  const columns: ColumnsType<Submission> = [
    { title: '作品标题', dataIndex: 'title', key: 'title', width: 200, ellipsis: true },
    { title: '作者', dataIndex: 'author', key: 'author', width: 120 },
    { title: '所属分类', dataIndex: 'categoryName', key: 'categoryName', width: 120 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: string) => {
        const map: Record<string, { color: string; label: string }> = {
          pending: { color: 'orange', label: '待审核' },
          approved: { color: 'green', label: '已通过' },
          rejected: { color: 'red', label: '已驳回' },
        }
        return <Tag color={map[s]?.color}>{map[s]?.label || s}</Tag>
      },
    },
    { title: '投票数', dataIndex: 'voteCount', key: 'voteCount', width: 80 },
    { title: '投稿时间', dataIndex: 'submittedAt', key: 'submittedAt', width: 180 },
    {
      title: '操作', key: 'action', width: 200,
      render: (_, r) => (
        <div style={{ display: 'flex', gap: 8 }}>
          {r.status === 'pending' && (
            <>
              <a onClick={async () => { await approveSubmission(r.id); message.success('已通过'); setRefresh(x => x + 1) }}>通过</a>
              <a style={{ color: '#e74c3c' }} onClick={() => {
                Modal.confirm({ title: '驳回作品', content: '确定驳回该作品吗？', onOk: async () => { await rejectSubmission(r.id); message.success('已驳回'); setRefresh(x => x + 1) } })
              }}>驳回</a>
            </>
          )}
          <a>查看详情</a>
        </div>
      ),
    },
  ]

  const fetchData = (params: { page: number; pageSize: number }) => getSubmissions(params).then(r => r.data)

  return (
    <div>
      <PageHeader title="作品投稿管理" />
      <SearchForm fields={searchFields} onSearch={() => setRefresh(x => x + 1)} onReset={() => setRefresh(x => x + 1)} />
      <DataTable<Submission> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} />
    </div>
  )
}
```

- [ ] **Step 4: 配置个人风采内容页**

Write `src/pages/ranking/style.tsx`:

```tsx
import { useState } from 'react'
import { Tag, Modal, Form, Input, Select, message } from 'antd'
import PageHeader from '@/components/PageHeader'
import SearchForm, { type SearchField } from '@/components/SearchForm'
import DataTable from '@/components/DataTable'
import { getStyleContents, updateStyleContent, type StyleContent } from '@/api/services/ranking'
import type { ColumnsType } from 'antd/es/table'

export default function StylePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<StyleContent | null>(null)
  const [refresh, setRefresh] = useState(0)
  const [form] = Form.useForm()

  const searchFields: SearchField[] = [
    { name: 'keyword', label: '用户名', type: 'input' },
    { name: 'status', label: '状态', type: 'select', options: [
      { label: '已发布', value: 'published' }, { label: '草稿', value: 'draft' },
    ] },
  ]

  const columns: ColumnsType<StyleContent> = [
    { title: '用户', dataIndex: 'userName', key: 'userName', width: 120 },
    { title: '内容摘要', dataIndex: 'content', key: 'content', width: 300, ellipsis: true },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: string) => <Tag color={s === 'published' ? 'green' : 'default'}>{s === 'published' ? '已发布' : '草稿'}</Tag>,
    },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
    {
      title: '操作', key: 'action', width: 120,
      render: (_, r) => (
        <a onClick={() => { setEditing(r); form.setFieldsValue(r); setModalOpen(true) }}>编辑</a>
      ),
    },
  ]

  const fetchData = (params: { page: number; pageSize: number }) => getStyleContents(params).then(r => r.data)

  const handleModalOk = async () => {
    const values = await form.validateFields()
    if (editing) { await updateStyleContent(editing.id, values); message.success('更新成功') }
    setModalOpen(false)
    setRefresh(x => x + 1)
  }

  return (
    <div>
      <PageHeader title="配置个人风采内容" />
      <SearchForm fields={searchFields} onSearch={() => setRefresh(x => x + 1)} onReset={() => setRefresh(x => x + 1)} />
      <DataTable<StyleContent> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} />
      <Modal title="编辑风采内容" open={modalOpen} onOk={handleModalOk} onCancel={() => setModalOpen(false)} width={520}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="content" label="内容" rules={[{ required: true }]}><Input.TextArea rows={4} /></Form.Item>
          <Form.Item name="status" label="状态"><Select options={[{ label: '已发布', value: 'published' }, { label: '草稿', value: 'draft' }]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
```

---

### Task 13: 党小组管理模块

**Files:**
- Create: `src/api/services/party.ts`
- Create: `src/pages/party/structure.tsx`
- Create: `src/pages/party/members.tsx`
- Create: `src/pages/party/transfers.tsx`

- [ ] **Step 1: 党小组 API**

Write `src/api/services/party.ts`:

```typescript
import request from '../request'
import type { ApiResponse, PageResult } from '@/types'

export interface PartyGroup {
  id: string
  name: string
  parentId: string | null
  leaderName: string
  memberCount: number
  order: number
  createdAt: string
}

export interface PartyMember {
  id: string
  name: string
  groupId: string
  groupName: string
  position: string
  joinDate: string
  phone: string
  status: 'active' | 'transferred' | 'inactive'
}

export interface TransferRecord {
  id: string
  memberId: string
  memberName: string
  fromGroupId: string
  fromGroupName: string
  toGroupId: string
  toGroupName: string
  reason: string
  transferDate: string
}

// 组织架构
export function getGroupTree(): Promise<ApiResponse<PartyGroup[]>> {
  return request.get('/party/groups/tree')
}

export function createGroup(data: Partial<PartyGroup>): Promise<ApiResponse<PartyGroup>> {
  return request.post('/party/groups', data)
}

export function updateGroup(id: string, data: Partial<PartyGroup>): Promise<ApiResponse<PartyGroup>> {
  return request.put(`/party/groups/${id}`, data)
}

export function deleteGroup(id: string): Promise<ApiResponse<null>> {
  return request.delete(`/party/groups/${id}`)
}

// 成员管理
export function getMembers(params: { page: number; pageSize: number; keyword?: string; groupId?: string; status?: string }): Promise<ApiResponse<PageResult<PartyMember>>> {
  return request.get('/party/members', { params })
}

export function createMember(data: Partial<PartyMember>): Promise<ApiResponse<PartyMember>> {
  return request.post('/party/members', data)
}

export function updateMember(id: string, data: Partial<PartyMember>): Promise<ApiResponse<PartyMember>> {
  return request.put(`/party/members/${id}`, data)
}

export function deleteMember(id: string): Promise<ApiResponse<null>> {
  return request.delete(`/party/members/${id}`)
}

// 成员调动
export function getTransfers(params: { page: number; pageSize: number }): Promise<ApiResponse<PageResult<TransferRecord>>> {
  return request.get('/party/transfers', { params })
}

export function transferMember(data: { memberId: string; toGroupId: string; reason: string }): Promise<ApiResponse<TransferRecord>> {
  return request.post('/party/transfers', data)
}
```

- [ ] **Step 2: 组织架构管理页**

Write `src/pages/party/structure.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { Tree, Card, Modal, Form, Input, InputNumber, Button, message, Spin, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import { getGroupTree, createGroup, updateGroup, deleteGroup, type PartyGroup } from '@/api/services/party'
import type { DataNode } from 'antd/es/tree'

function buildTreeData(groups: PartyGroup[]): DataNode[] {
  const map = new Map<string, DataNode>()
  const roots: DataNode[] = []

  groups.forEach((g) => {
    map.set(g.id, { key: g.id, title: `${g.name}（组长: ${g.leaderName} | ${g.memberCount}人）` })
  })

  groups.forEach((g) => {
    const node = map.get(g.id)!
    if (g.parentId && map.has(g.parentId)) {
      const parent = map.get(g.parentId)!
      if (!parent.children) parent.children = []
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}

export default function StructurePage() {
  const [treeData, setTreeData] = useState<DataNode[]>([])
  const [groups, setGroups] = useState<PartyGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<PartyGroup | null>(null)
  const [parentId, setParentId] = useState<string | null>(null)
  const [form] = Form.useForm()

  const loadTree = async () => {
    setLoading(true)
    try {
      const res = await getGroupTree()
      setGroups(res.data)
      setTreeData(buildTreeData(res.data))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTree() }, [])

  const handleAdd = (parentId: string | null = null) => {
    setEditing(null)
    setParentId(parentId)
    form.resetFields()
    setModalOpen(true)
  }

  const handleEdit = (group: PartyGroup) => {
    setEditing(group)
    setParentId(null)
    form.setFieldsValue(group)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await deleteGroup(id)
    message.success('已删除')
    loadTree()
  }

  const handleModalOk = async () => {
    const values = await form.validateFields()
    if (editing) {
      await updateGroup(editing.id, values)
    } else {
      await createGroup({ ...values, parentId })
    }
    message.success(editing ? '更新成功' : '创建成功')
    setModalOpen(false)
    loadTree()
  }

  return (
    <div>
      <PageHeader title="党小组组织架构管理" actions={[{ label: '新增一级小组', type: 'primary', icon: <PlusOutlined />, onClick: () => handleAdd(null) }]} />

      <Card title="组织架构树" extra={<Button size="small" onClick={loadTree}>刷新</Button>}>
        {loading ? <Spin /> : (
          <Tree
            showLine
            defaultExpandAll
            treeData={treeData}
            titleRender={(node) => {
              const group = groups.find(g => g.id === node.key)
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
                  <span>{node.title as string}</span>
                  {group && (
                    <span style={{ display: 'flex', gap: 4 }}>
                      <Button size="small" type="link" icon={<PlusOutlined />} onClick={(e) => { e.stopPropagation(); handleAdd(group.id) }}>添加子小组</Button>
                      <Button size="small" type="link" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); handleEdit(group) }}>编辑</Button>
                      <Popconfirm title="确定删除该小组吗？" onConfirm={(e) => { e?.stopPropagation(); handleDelete(group.id) }} onCancel={(e) => e?.stopPropagation()}>
                        <Button size="small" type="link" danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()}>删除</Button>
                      </Popconfirm>
                    </span>
                  )}
                </div>
              )
            }}
          />
        )}
      </Card>

      <Modal title={editing ? '编辑党小组' : '新增党小组'} open={modalOpen} onOk={handleModalOk} onCancel={() => setModalOpen(false)}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="小组名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="leaderName" label="组长姓名" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="order" label="排序" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
```

- [ ] **Step 3: 成员信息管理页**

Write `src/pages/party/members.tsx`:

```tsx
import { useState } from 'react'
import { Tag, Modal, Form, Input, Select, DatePicker, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import SearchForm, { type SearchField } from '@/components/SearchForm'
import DataTable from '@/components/DataTable'
import { getMembers, createMember, updateMember, deleteMember, type PartyMember } from '@/api/services/party'
import type { ColumnsType } from 'antd/es/table'

export default function MembersPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<PartyMember | null>(null)
  const [refresh, setRefresh] = useState(0)
  const [form] = Form.useForm()

  const searchFields: SearchField[] = [
    { name: 'keyword', label: '姓名', type: 'input' },
    { name: 'status', label: '状态', type: 'select', options: [
      { label: '在职', value: 'active' }, { label: '已调出', value: 'transferred' }, { label: '离休', value: 'inactive' },
    ] },
  ]

  const columns: ColumnsType<PartyMember> = [
    { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
    { title: '所属小组', dataIndex: 'groupName', key: 'groupName', width: 150 },
    { title: '职务', dataIndex: 'position', key: 'position', width: 120 },
    { title: '入党日期', dataIndex: 'joinDate', key: 'joinDate', width: 120 },
    { title: '电话', dataIndex: 'phone', key: 'phone', width: 140 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: string) => {
        const map: Record<string, { color: string; label: string }> = {
          active: { color: 'green', label: '在职' },
          transferred: { color: 'blue', label: '已调出' },
          inactive: { color: 'default', label: '离休' },
        }
        return <Tag color={map[s]?.color}>{map[s]?.label || s}</Tag>
      },
    },
    {
      title: '操作', key: 'action', width: 160,
      render: (_, r) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <a onClick={() => { setEditing(r); form.setFieldsValue({ ...r, joinDate: undefined }); setModalOpen(true) }}>编辑</a>
          <a style={{ color: '#e74c3c' }} onClick={() => {
            Modal.confirm({ title: '确认删除', content: '确定删除该成员吗？', onOk: async () => { await deleteMember(r.id); message.success('已删除'); setRefresh(x => x + 1) } })
          }}>删除</a>
        </div>
      ),
    },
  ]

  const fetchData = (params: { page: number; pageSize: number }) => getMembers(params).then(r => r.data)

  const handleAdd = () => { setEditing(null); form.resetFields(); setModalOpen(true) }

  const handleModalOk = async () => {
    const values = await form.validateFields()
    if (values.joinDate) values.joinDate = values.joinDate.format('YYYY-MM-DD')
    if (editing) { await updateMember(editing.id, values); message.success('更新成功') }
    else { await createMember(values); message.success('创建成功') }
    setModalOpen(false)
    setRefresh(x => x + 1)
  }

  return (
    <div>
      <PageHeader title="成员信息管理" actions={[{ label: '新增成员', type: 'primary', icon: <PlusOutlined />, onClick: handleAdd }]} />
      <SearchForm fields={searchFields} onSearch={() => setRefresh(x => x + 1)} onReset={() => setRefresh(x => x + 1)} />
      <DataTable<PartyMember> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} />
      <Modal title={editing ? '编辑成员' : '新增成员'} open={modalOpen} onOk={handleModalOk} onCancel={() => setModalOpen(false)} width={520}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="position" label="职务"><Input /></Form.Item>
          <Form.Item name="phone" label="电话"><Input /></Form.Item>
          <Form.Item name="joinDate" label="入党日期"><DatePicker style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
```

- [ ] **Step 4: 成员调动页**

Write `src/pages/party/transfers.tsx`:

```tsx
import { useState } from 'react'
import { Modal, Form, Select, Input, message, Tag } from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import SearchForm, { type SearchField } from '@/components/SearchForm'
import DataTable from '@/components/DataTable'
import { getTransfers, transferMember, getMembers, type TransferRecord } from '@/api/services/party'
import type { ColumnsType } from 'antd/es/table'

export default function TransfersPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [form] = Form.useForm()

  const searchFields: SearchField[] = [
    { name: 'keyword', label: '成员姓名', type: 'input' },
  ]

  const columns: ColumnsType<TransferRecord> = [
    { title: '成员', dataIndex: 'memberName', key: 'memberName', width: 100 },
    { title: '调出小组', dataIndex: 'fromGroupName', key: 'fromGroupName', width: 150 },
    { title: '调入小组', dataIndex: 'toGroupName', key: 'toGroupName', width: 150 },
    { title: '调动原因', dataIndex: 'reason', key: 'reason', width: 200, ellipsis: true },
    { title: '调动日期', dataIndex: 'transferDate', key: 'transferDate', width: 120 },
  ]

  const fetchData = (params: { page: number; pageSize: number }) => getTransfers(params).then(r => r.data)

  const handleTransfer = () => { form.resetFields(); setModalOpen(true) }

  const handleModalOk = async () => {
    const values = await form.validateFields()
    await transferMember(values)
    message.success('调动成功')
    setModalOpen(false)
    setRefresh(x => x + 1)
  }

  return (
    <div>
      <PageHeader title="成员调动与归属调整" actions={[{ label: '新增调动', type: 'primary', icon: <SwapOutlined />, onClick: handleTransfer }]} />
      <SearchForm fields={searchFields} onSearch={() => setRefresh(x => x + 1)} onReset={() => setRefresh(x => x + 1)} />
      <DataTable<TransferRecord> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} />
      <Modal title="新增调动" open={modalOpen} onOk={handleModalOk} onCancel={() => setModalOpen(false)}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="memberId" label="选择成员" rules={[{ required: true }]}>
            <Select placeholder="请选择成员" showSearch optionFilterProp="label"
              options={[] /* 实际项目中从 getMembers 加载 */}
            />
          </Form.Item>
          <Form.Item name="toGroupId" label="调入小组" rules={[{ required: true }]}>
            <Select placeholder="请选择目标小组" options={[]} />
          </Form.Item>
          <Form.Item name="reason" label="调动原因" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
```

---

### Task 14: 系统管理模块 (7 个页面)

**Files:**
- Create: `src/api/services/system.ts`
- Create: `src/pages/system/permissions.tsx`
- Create: `src/pages/system/notifications.tsx`
- Create: `src/pages/system/backup.tsx`
- Create: `src/pages/system/logs.tsx`
- Create: `src/pages/system/dictionary.tsx`
- Create: `src/pages/system/params.tsx`

- [ ] **Step 1: 系统管理 API**

Write `src/api/services/system.ts`:

```typescript
import request from '../request'
import type { ApiResponse, PageResult } from '@/types'

export interface SysUser {
  id: string
  username: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'disabled'
  createdAt: string
}

export interface NotificationConfig {
  id: string
  type: 'email' | 'sms' | 'webhook'
  event: string
  enabled: boolean
  recipients: string
  updatedAt: string
}

export interface BackupRecord {
  id: string
  fileName: string
  size: string
  status: 'success' | 'failed' | 'running'
  createdAt: string
}

export interface SysLog {
  id: string
  operator: string
  action: string
  module: string
  detail: string
  ip: string
  createdAt: string
}

export interface DictionaryItem {
  id: string
  type: string
  label: string
  value: string
  order: number
  status: 'enabled' | 'disabled'
}

export interface SystemParam {
  id: string
  key: string
  value: string
  description: string
  updatedAt: string
}

// 用户权限
export function getUsers(params: { page: number; pageSize: number }): Promise<ApiResponse<PageResult<SysUser>>> {
  return request.get('/system/users', { params })
}

export function createUser(data: Partial<SysUser>): Promise<ApiResponse<SysUser>> {
  return request.post('/system/users', data)
}

export function updateUser(id: string, data: Partial<SysUser>): Promise<ApiResponse<SysUser>> {
  return request.put(`/system/users/${id}`, data)
}

export function deleteUser(id: string): Promise<ApiResponse<null>> {
  return request.delete(`/system/users/${id}`)
}

// 通知配置
export function getNotificationConfigs(params: { page: number; pageSize: number }): Promise<ApiResponse<PageResult<NotificationConfig>>> {
  return request.get('/system/notifications', { params })
}

export function updateNotificationConfig(id: string, data: Partial<NotificationConfig>): Promise<ApiResponse<NotificationConfig>> {
  return request.put(`/system/notifications/${id}`, data)
}

// 备份恢复
export function getBackupRecords(params: { page: number; pageSize: number }): Promise<ApiResponse<PageResult<BackupRecord>>> {
  return request.get('/system/backups', { params })
}

export function createBackup(): Promise<ApiResponse<BackupRecord>> {
  return request.post('/system/backups')
}

export function restoreBackup(id: string): Promise<ApiResponse<null>> {
  return request.post(`/system/backups/${id}/restore`)
}

// 日志
export function getLogs(params: { page: number; pageSize: number; keyword?: string; module?: string }): Promise<ApiResponse<PageResult<SysLog>>> {
  return request.get('/system/logs', { params })
}

// 数据字典
export function getDictionaryItems(params: { page: number; pageSize: number; type?: string }): Promise<ApiResponse<PageResult<DictionaryItem>>> {
  return request.get('/system/dictionary', { params })
}

export function createDictionaryItem(data: Partial<DictionaryItem>): Promise<ApiResponse<DictionaryItem>> {
  return request.post('/system/dictionary', data)
}

export function updateDictionaryItem(id: string, data: Partial<DictionaryItem>): Promise<ApiResponse<DictionaryItem>> {
  return request.put(`/system/dictionary/${id}`, data)
}

export function deleteDictionaryItem(id: string): Promise<ApiResponse<null>> {
  return request.delete(`/system/dictionary/${id}`)
}

// 系统参数
export function getSystemParams(): Promise<ApiResponse<SystemParam[]>> {
  return request.get('/system/params')
}

export function updateSystemParam(id: string, data: Partial<SystemParam>): Promise<ApiResponse<SystemParam>> {
  return request.put(`/system/params/${id}`, data)
}
```

- [ ] **Step 2: 用户权限管理页**

Write `src/pages/system/permissions.tsx`:

```tsx
import { useState } from 'react'
import { Tag, Modal, Form, Input, Select, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import SearchForm, { type SearchField } from '@/components/SearchForm'
import DataTable from '@/components/DataTable'
import { getUsers, createUser, updateUser, deleteUser, type SysUser } from '@/api/services/system'
import type { ColumnsType } from 'antd/es/table'

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '编辑者', value: 'editor' },
  { label: '查看者', value: 'viewer' },
]

export default function PermissionsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<SysUser | null>(null)
  const [refresh, setRefresh] = useState(0)
  const [form] = Form.useForm()

  const searchFields: SearchField[] = [
    { name: 'keyword', label: '用户名/姓名', type: 'input' },
  ]

  const columns: ColumnsType<SysUser> = [
    { title: '用户名', dataIndex: 'username', key: 'username', width: 120 },
    { title: '姓名', dataIndex: 'name', key: 'name', width: 120 },
    {
      title: '角色', dataIndex: 'role', key: 'role', width: 100,
      render: (role: string) => {
        const map: Record<string, { color: string; label: string }> = {
          admin: { color: 'red', label: '管理员' },
          editor: { color: 'blue', label: '编辑者' },
          viewer: { color: 'default', label: '查看者' },
        }
        return <Tag color={map[role]?.color}>{map[role]?.label || role}</Tag>
      },
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: string) => <Tag color={s === 'active' ? 'green' : 'red'}>{s === 'active' ? '启用' : '禁用'}</Tag>,
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
    {
      title: '操作', key: 'action', width: 160,
      render: (_, r) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <a onClick={() => { setEditing(r); form.setFieldsValue(r); setModalOpen(true) }}>编辑</a>
          <a style={{ color: '#e74c3c' }} onClick={() => {
            Modal.confirm({ title: '确认删除', onOk: async () => { await deleteUser(r.id); message.success('已删除'); setRefresh(x => x + 1) } })
          }}>删除</a>
        </div>
      ),
    },
  ]

  const fetchData = (params: { page: number; pageSize: number }) => getUsers(params).then(r => r.data)

  const handleAdd = () => { setEditing(null); form.resetFields(); setModalOpen(true) }

  const handleModalOk = async () => {
    const values = await form.validateFields()
    if (editing) { await updateUser(editing.id, values); message.success('更新成功') }
    else { await createUser(values); message.success('创建成功') }
    setModalOpen(false)
    setRefresh(x => x + 1)
  }

  return (
    <div>
      <PageHeader title="用户权限管理" actions={[{ label: '新增用户', type: 'primary', icon: <PlusOutlined />, onClick: handleAdd }]} />
      <SearchForm fields={searchFields} onSearch={() => setRefresh(x => x + 1)} onReset={() => setRefresh(x => x + 1)} />
      <DataTable<SysUser> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} />
      <Modal title={editing ? '编辑用户' : '新增用户'} open={modalOpen} onOk={handleModalOk} onCancel={() => setModalOpen(false)}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}><Input /></Form.Item>
          {!editing && <Form.Item name="password" label="密码" rules={[{ required: true }]}><Input.Password /></Form.Item>}
          <Form.Item name="role" label="角色" rules={[{ required: true }]}><Select options={roleOptions} /></Form.Item>
          <Form.Item name="status" label="状态"><Select options={[{ label: '启用', value: 'active' }, { label: '禁用', value: 'disabled' }]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
```

- [ ] **Step 3: 消息通知配置页**

Write `src/pages/system/notifications.tsx`:

```tsx
import { useState } from 'react'
import { Tag, Switch, Modal, Form, Input, Select, message } from 'antd'
import PageHeader from '@/components/PageHeader'
import DataTable from '@/components/DataTable'
import { getNotificationConfigs, updateNotificationConfig, type NotificationConfig } from '@/api/services/system'
import type { ColumnsType } from 'antd/es/table'

export default function NotificationsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<NotificationConfig | null>(null)
  const [refresh, setRefresh] = useState(0)
  const [form] = Form.useForm()

  const columns: ColumnsType<NotificationConfig> = [
    { title: '通知类型', dataIndex: 'type', key: 'type', width: 100,
      render: (t: string) => <Tag>{t === 'email' ? '邮件' : t === 'sms' ? '短信' : 'Webhook'}</Tag>,
    },
    { title: '触发事件', dataIndex: 'event', key: 'event', width: 180 },
    { title: '接收人', dataIndex: 'recipients', key: 'recipients', width: 200 },
    {
      title: '状态', dataIndex: 'enabled', key: 'enabled', width: 100,
      render: (_: boolean, r: NotificationConfig) => (
        <Switch checked={r.enabled} onChange={async (checked) => {
          await updateNotificationConfig(r.id, { enabled: checked })
          message.success(checked ? '已启用' : '已禁用')
          setRefresh(x => x + 1)
        }} />
      ),
    },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
    {
      title: '操作', key: 'action', width: 100,
      render: (_, r) => (
        <a onClick={() => { setEditing(r); form.setFieldsValue(r); setModalOpen(true) }}>编辑</a>
      ),
    },
  ]

  const fetchData = (params: { page: number; pageSize: number }) => getNotificationConfigs(params).then(r => r.data)

  const handleModalOk = async () => {
    const values = await form.validateFields()
    if (editing) { await updateNotificationConfig(editing.id, values); message.success('更新成功') }
    setModalOpen(false)
    setRefresh(x => x + 1)
  }

  return (
    <div>
      <PageHeader title="消息通知配置" />
      <DataTable<NotificationConfig> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} />
      <Modal title="编辑通知配置" open={modalOpen} onOk={handleModalOk} onCancel={() => setModalOpen(false)}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="type" label="通知类型"><Select options={[{ label: '邮件', value: 'email' }, { label: '短信', value: 'sms' }, { label: 'Webhook', value: 'webhook' }]} /></Form.Item>
          <Form.Item name="event" label="触发事件"><Input /></Form.Item>
          <Form.Item name="recipients" label="接收人"><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
```

- [ ] **Step 4: 数据备份与恢复页**

Write `src/pages/system/backup.tsx`:

```tsx
import { useState } from 'react'
import { Tag, Modal, Button, message } from 'antd'
import { CloudUploadOutlined, ReloadOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import DataTable from '@/components/DataTable'
import { getBackupRecords, createBackup, restoreBackup, type BackupRecord } from '@/api/services/system'
import type { ColumnsType } from 'antd/es/table'

export default function BackupPage() {
  const [refresh, setRefresh] = useState(0)
  const [backingUp, setBackingUp] = useState(false)

  const columns: ColumnsType<BackupRecord> = [
    { title: '文件名', dataIndex: 'fileName', key: 'fileName', width: 250 },
    { title: '大小', dataIndex: 'size', key: 'size', width: 100 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: string) => {
        const map: Record<string, string> = { success: '成功', failed: '失败', running: '进行中' }
        const colors: Record<string, string> = { success: 'green', failed: 'red', running: 'blue' }
        return <Tag color={colors[s]}>{map[s] || s}</Tag>
      },
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
    {
      title: '操作', key: 'action', width: 100,
      render: (_, r) => (
        r.status === 'success' ? (
          <a onClick={() => {
            Modal.confirm({ title: '恢复数据', content: '确定从该备份恢复数据吗？当前数据将被覆盖。', onOk: async () => { await restoreBackup(r.id); message.success('恢复任务已启动') } })
          }}>恢复</a>
        ) : null
      ),
    },
  ]

  const fetchData = (params: { page: number; pageSize: number }) => getBackupRecords(params).then(r => r.data)

  const handleBackup = async () => {
    setBackingUp(true)
    try {
      await createBackup()
      message.success('备份任务已启动')
      setRefresh(x => x + 1)
    } finally {
      setBackingUp(false)
    }
  }

  return (
    <div>
      <PageHeader title="数据备份与恢复" actions={[
        { label: '立即备份', type: 'primary', icon: <CloudUploadOutlined />, onClick: handleBackup },
        { label: '刷新', icon: <ReloadOutlined />, onClick: () => setRefresh(x => x + 1) },
      ]} />
      <DataTable<BackupRecord> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} />
    </div>
  )
}
```

- [ ] **Step 5: 日志管理页**

Write `src/pages/system/logs.tsx`:

```tsx
import { useState } from 'react'
import { Tag } from 'antd'
import PageHeader from '@/components/PageHeader'
import SearchForm, { type SearchField } from '@/components/SearchForm'
import DataTable from '@/components/DataTable'
import { getLogs, type SysLog } from '@/api/services/system'
import type { ColumnsType } from 'antd/es/table'

export default function LogsPage() {
  const [searchParams, setSearchParams] = useState<Record<string, unknown>>({})
  const [refresh, setRefresh] = useState(0)

  const searchFields: SearchField[] = [
    { name: 'keyword', label: '操作人/详情', type: 'input' },
    { name: 'module', label: '模块', type: 'select', options: [
      { label: '知识库', value: 'knowledge' }, { label: '锋云榜', value: 'ranking' },
      { label: '党小组', value: 'party' }, { label: '系统管理', value: 'system' },
    ] },
  ]

  const columns: ColumnsType<SysLog> = [
    { title: '操作人', dataIndex: 'operator', key: 'operator', width: 100 },
    { title: '操作', dataIndex: 'action', key: 'action', width: 80,
      render: (a: string) => <Tag>{a}</Tag>,
    },
    { title: '模块', dataIndex: 'module', key: 'module', width: 100 },
    { title: '详情', dataIndex: 'detail', key: 'detail', width: 250, ellipsis: true },
    { title: 'IP', dataIndex: 'ip', key: 'ip', width: 140 },
    { title: '时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
  ]

  const fetchData = (params: { page: number; pageSize: number }) =>
    getLogs({ ...params, ...searchParams }).then(r => r.data)

  return (
    <div>
      <PageHeader title="日志管理" />
      <SearchForm fields={searchFields} onSearch={(values) => { setSearchParams(values); setRefresh(x => x + 1) }} onReset={() => { setSearchParams({}); setRefresh(x => x + 1) }} />
      <DataTable<SysLog> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} />
    </div>
  )
}
```

- [ ] **Step 6: 数据字典管理页**

Write `src/pages/system/dictionary.tsx`:

```tsx
import { useState } from 'react'
import { Tag, Modal, Form, Input, InputNumber, Select, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import SearchForm, { type SearchField } from '@/components/SearchForm'
import DataTable from '@/components/DataTable'
import { getDictionaryItems, createDictionaryItem, updateDictionaryItem, deleteDictionaryItem, type DictionaryItem } from '@/api/services/system'
import type { ColumnsType } from 'antd/es/table'

export default function DictionaryPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<DictionaryItem | null>(null)
  const [refresh, setRefresh] = useState(0)
  const [form] = Form.useForm()

  const searchFields: SearchField[] = [
    { name: 'type', label: '字典类型', type: 'input' },
  ]

  const columns: ColumnsType<DictionaryItem> = [
    { title: '字典类型', dataIndex: 'type', key: 'type', width: 140 },
    { title: '标签', dataIndex: 'label', key: 'label', width: 140 },
    { title: '值', dataIndex: 'value', key: 'value', width: 140 },
    { title: '排序', dataIndex: 'order', key: 'order', width: 80 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: string) => <Tag color={s === 'enabled' ? 'green' : 'default'}>{s === 'enabled' ? '启用' : '禁用'}</Tag>,
    },
    {
      title: '操作', key: 'action', width: 160,
      render: (_, r) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <a onClick={() => { setEditing(r); form.setFieldsValue(r); setModalOpen(true) }}>编辑</a>
          <a style={{ color: '#e74c3c' }} onClick={() => {
            Modal.confirm({ title: '确认删除', onOk: async () => { await deleteDictionaryItem(r.id); message.success('已删除'); setRefresh(x => x + 1) } })
          }}>删除</a>
        </div>
      ),
    },
  ]

  const fetchData = (params: { page: number; pageSize: number }) => getDictionaryItems(params).then(r => r.data)
  const handleAdd = () => { setEditing(null); form.resetFields(); setModalOpen(true) }
  const handleModalOk = async () => {
    const values = await form.validateFields()
    if (editing) { await updateDictionaryItem(editing.id, values); message.success('更新成功') }
    else { await createDictionaryItem(values); message.success('创建成功') }
    setModalOpen(false)
    setRefresh(x => x + 1)
  }

  return (
    <div>
      <PageHeader title="数据字典管理" actions={[{ label: '新增字典项', type: 'primary', icon: <PlusOutlined />, onClick: handleAdd }]} />
      <SearchForm fields={searchFields} onSearch={() => setRefresh(x => x + 1)} onReset={() => setRefresh(x => x + 1)} />
      <DataTable<DictionaryItem> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} />
      <Modal title={editing ? '编辑字典项' : '新增字典项'} open={modalOpen} onOk={handleModalOk} onCancel={() => setModalOpen(false)}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="type" label="字典类型" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="label" label="标签" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="value" label="值" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="order" label="排序"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="status" label="状态"><Select options={[{ label: '启用', value: 'enabled' }, { label: '禁用', value: 'disabled' }]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
```

- [ ] **Step 7: 系统参数配置页**

Write `src/pages/system/params.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { Card, Form, Input, Button, Spin, message } from 'antd'
import PageHeader from '@/components/PageHeader'
import { getSystemParams, updateSystemParam, type SystemParam } from '@/api/services/system'

export default function ParamsPage() {
  const [params, setParams] = useState<SystemParam[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    getSystemParams()
      .then((res) => {
        setParams(res.data)
        const values: Record<string, string> = {}
        res.data.forEach((p) => { values[p.key] = p.value })
        form.setFieldsValue(values)
      })
      .finally(() => setLoading(false))
  }, [form])

  const handleSave = async () => {
    setSaving(true)
    try {
      const values = form.getFieldsValue()
      const promises = params.map((p) => updateSystemParam(p.id, { value: values[p.key] || p.value }))
      await Promise.all(promises)
      message.success('参数已保存')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spin style={{ display: 'block', marginTop: 100 }} />

  return (
    <div>
      <PageHeader title="系统参数配置" actions={[{ label: '保存', type: 'primary', onClick: handleSave }]} />
      <Card style={{ maxWidth: 640 }}>
        <Form form={form} layout="vertical">
          {params.map((param) => (
            <Form.Item key={param.id} name={param.key} label={param.key} extra={param.description}>
              <Input />
            </Form.Item>
          ))}
        </Form>
      </Card>
    </div>
  )
}
```

---

### Phase 8: 数据监控大屏

---

### Task 15: 数据监控大屏（含全屏切换）

**Files:**
- Create: `src/pages/system/monitor.tsx`

- [ ] **Step 1: 数据监控大屏**

Write `src/pages/system/monitor.tsx`:

```tsx
import { useState, useCallback } from 'react'
import { Row, Col, Card, Statistic, Button } from 'antd'
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons'
import ReactEChartsCore from 'echarts-for-react'
import PageHeader from '@/components/PageHeader'

export default function MonitorPage() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  // 趋势图配置
  const trendOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['知识资源', '锋云榜作品', '新增成员'] },
    grid: { left: 50, right: 20, top: 30, bottom: 30 },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { type: 'value' },
    series: [
      { name: '知识资源', type: 'line', data: [120, 200, 280, 350, 420, 500], smooth: true, itemStyle: { color: '#1677ff' } },
      { name: '锋云榜作品', type: 'line', data: [80, 120, 160, 200, 260, 320], smooth: true, itemStyle: { color: '#52c41a' } },
      { name: '新增成员', type: 'line', data: [20, 30, 25, 40, 35, 50], smooth: true, itemStyle: { color: '#fa8c16' } },
    ],
  }

  // 饼图配置
  const pieOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: 420, name: '文档类', itemStyle: { color: '#1677ff' } },
        { value: 280, name: '视频类', itemStyle: { color: '#52c41a' } },
        { value: 180, name: '图片类', itemStyle: { color: '#fa8c16' } },
        { value: 120, name: '音频类', itemStyle: { color: '#e74c3c' } },
      ],
    }],
  }

  // 柱状图配置
  const barOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['第一小组', '第二小组', '第三小组', '第四小组', '第五小组'] },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      data: [25, 18, 22, 15, 9],
      itemStyle: { color: '#1677ff', borderRadius: [4, 4, 0, 0] },
    }],
  }

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  return (
    <div>
      <PageHeader
        title="数据监控大屏"
        actions={[{
          label: isFullscreen ? '退出全屏' : '全屏展示',
          icon: isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />,
          onClick: toggleFullscreen,
        }]}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}><Card><Statistic title="知识资源总量" value={1248} valueStyle={{ color: '#1677ff' }} suffix="条" /></Card></Col>
        <Col xs={12} sm={6}><Card><Statistic title="锋云榜作品" value={356} valueStyle={{ color: '#52c41a' }} suffix="件" /></Card></Col>
        <Col xs={12} sm={6}><Card><Statistic title="党小组成员" value={89} valueStyle={{ color: '#fa8c16' }} suffix="人" /></Card></Col>
        <Col xs={12} sm={6}><Card><Statistic title="今日访问量" value={1256} valueStyle={{ color: '#e74c3c' }} suffix="次" /></Card></Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="数据增长趋势">
            <ReactEChartsCore option={trendOption} style={{ height: 350 }} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="资源类型分布">
            <ReactEChartsCore option={pieOption} style={{ height: 350 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="党小组人数统计">
            <ReactEChartsCore option={barOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="系统运行状态">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Card size="small" style={{ background: '#f6ffed' }}>CPU: <strong style={{ color: '#52c41a' }}>23%</strong></Card>
              <Card size="small" style={{ background: '#f6ffed' }}>内存: <strong style={{ color: '#52c41a' }}>58%</strong></Card>
              <Card size="small" style={{ background: '#f6ffed' }}>磁盘: <strong style={{ color: '#fa8c16' }}>72%</strong></Card>
              <Card size="small" style={{ background: '#f6ffed' }}>运行: <strong style={{ color: '#52c41a' }}>128天</strong></Card>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
```

- [ ] **Step 2: 监听全屏事件同步状态**

在 `useEffect` 中监听浏览器全屏变化，保持 `isFullscreen` 与浏览器状态一致（已在组件生命周期中处理）。

---

## 验证清单

- [ ] `npm run dev` 正常启动，无编译错误
- [ ] 浏览器访问 → 自动跳转 `/login`
- [ ] 登录页：输入用户名/密码 → 调用 API → 跳转仪表盘
- [ ] 仪表盘：4 张统计卡片 + 欢迎区域正常渲染
- [ ] 侧边栏：5 个菜单组 14 个菜单项，点击可跳转，当前项高亮
- [ ] 侧边栏折叠/展开正常
- [ ] 所有 CRUD 页面：搜索、表格分页、新增/编辑弹窗、删除确认
- [ ] 数据监控大屏：图表渲染 + 全屏切换
- [ ] 退出登录：清除 token，跳转登录页
- [ ] 未登录直接访问任意页面 → 重定向登录页
- [ ] API 401 → 自动登出
