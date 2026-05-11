# AI思政 — 智能思想政治教育管理平台 设计文档

**日期**: 2026-05-09

**技术栈**: React + TypeScript + Vite + antd + TailwindCSS v4 + axios + zustand + react-router v6

---

## 1. 项目概述

前后端分离的中后台管理系统，前端通过 axios 对接后端 API。包含 4 大模块 14 个功能页 + 登录页 + 仪表盘。

### 功能模块

| 模块 | 子功能 |
|------|--------|
| 知识库管理 | 多模态资源维护、知识检索与推荐配置 |
| 锋云榜管理 | 榜单分类管理、作品投稿管理、配置个人风采内容 |
| 党小组及成员管理 | 党小组组织架构管理、成员信息管理、成员调动与归属调整 |
| 系统管理 | 用户权限管理、消息通知配置、数据备份与恢复、数据监控大屏、日志管理、数据字典管理、系统参数配置 |

---

## 2. 视觉设计

- **配色**: 蓝白科技风为主（#1677ff），红色点缀（#e74c3c），深色侧边栏（#001529），浅灰背景（#f0f2f5）
- **布局**: 深色侧边栏 + 白色顶栏 + 浅灰内容区，antd ProLayout 模式
- **数据监控大屏**: 嵌入常规布局，支持全屏切换

---

## 3. 项目结构

```
ai-sizheng-admin/
├── public/
├── src/
│   ├── api/
│   │   ├── request.ts            # axios 实例 + 拦截器（token 注入 / 401 处理）
│   │   └── modules/
│   │       ├── auth.ts
│   │       ├── knowledge.ts
│   │       ├── ranking.ts
│   │       ├── party.ts
│   │       └── system.ts
│   ├── stores/
│   │   ├── authStore.ts          # token + userInfo + login/logout
│   │   └── appStore.ts           # sidebarCollapsed + breadcrumbs + globalLoading
│   ├── router/
│   │   ├── index.tsx             # createBrowserRouter 路由表
│   │   ├── routes.ts             # 路由路径常量
│   │   └── AuthGuard.tsx         # 路由守卫（无 token → /login）
│   ├── layouts/
│   │   ├── MainLayout.tsx        # 侧边栏 + 顶栏 + Outlet
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── pages/
│   │   ├── login/                # LoginPage
│   │   ├── dashboard/            # DashboardPage（统计卡片 + 图表）
│   │   ├── knowledge/
│   │   │   ├── ResourcesPage     # 多模态资源维护（CRUD 表格）
│   │   │   └── RecommendPage     # 知识检索与推荐配置
│   │   ├── ranking/
│   │   │   ├── CategoriesPage    # 榜单分类管理（CRUD 表格）
│   │   │   ├── SubmissionsPage   # 作品投稿管理（CRUD 表格）
│   │   │   └── StylePage         # 配置个人风采内容
│   │   ├── party/
│   │   │   ├── StructurePage     # 党小组组织架构管理（树形 + CRUD）
│   │   │   ├── MembersPage       # 成员信息管理（CRUD 表格）
│   │   │   └── TransfersPage     # 成员调动与归属调整
│   │   └── system/
│   │       ├── PermissionsPage   # 用户权限管理（CRUD 表格）
│   │       ├── NotificationsPage # 消息通知配置
│   │       ├── BackupPage        # 数据备份与恢复
│   │       ├── MonitorPage       # 数据监控大屏（全屏切换）
│   │       ├── LogsPage          # 日志管理（CRUD 表格 + 搜索）
│   │       ├── DictionaryPage    # 数据字典管理（CRUD 表格）
│   │       └── ParamsPage        # 系统参数配置
│   ├── components/
│   │   ├── PageHeader.tsx        # 页面标题 + 面包屑 + 操作区
│   │   ├── SearchForm.tsx        # 通用搜索筛选栏
│   │   └── DataTable.tsx         # 通用表格封装（分页/loading/空状态/操作列）
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   ├── styles/
│   │   └── index.css             # @theme + @import "tailwindcss"
│   ├── App.tsx
│   └── main.tsx
├── vite.config.ts                # @tailwindcss/vite 插件
└── package.json
```

---

## 4. 路由设计

| 路径 | 页面 | 布局 |
|------|------|------|
| `/login` | 登录页 | 独立（无 Layout） |
| `/` | 仪表盘 | MainLayout |
| `/knowledge/resources` | 多模态资源维护 | MainLayout |
| `/knowledge/recommend` | 知识检索与推荐配置 | MainLayout |
| `/ranking/categories` | 榜单分类管理 | MainLayout |
| `/ranking/submissions` | 作品投稿管理 | MainLayout |
| `/ranking/style` | 配置个人风采内容 | MainLayout |
| `/party/structure` | 党小组组织架构管理 | MainLayout |
| `/party/members` | 成员信息管理 | MainLayout |
| `/party/transfers` | 成员调动与归属调整 | MainLayout |
| `/system/permissions` | 用户权限管理 | MainLayout |
| `/system/notifications` | 消息通知配置 | MainLayout |
| `/system/backup` | 数据备份与恢复 | MainLayout |
| `/system/monitor` | 数据监控大屏 | MainLayout |
| `/system/logs` | 日志管理 | MainLayout |
| `/system/dictionary` | 数据字典管理 | MainLayout |
| `/system/params` | 系统参数配置 | MainLayout |

- 路由守卫 `AuthGuard`：检查 token 是否存在，不存在重定向 `/login`
- 所有 MainLayout 下的路由通过 `<Outlet>` 渲染

---

## 5. 认证与 API 层

### 登录流程

```
POST /api/auth/login { username, password }
  → { token, user: { id, name, avatar, role } }
  → authStore: 存储 token + userInfo
  → token 持久化 localStorage + 写入 axios 默认请求头
```

### Axios 拦截器

- **请求拦截**: 自动附加 `Authorization: Bearer <token>`
- **响应拦截**: 401 → 清除登录态跳转 `/login` / 网络错误 → 统一 toast 提示

### 权限模型

- 角色: `admin` / `editor` / `viewer`
- 页面级: 路由 `meta.roles` 控制菜单可见性
- 操作级: 按钮/接口权限预留，后续扩展

---

## 6. 状态管理

```
authStore:  token, userInfo, login(), logout()
appStore:   sidebarCollapsed, breadcrumbs, globalLoading, toggleSidebar()
```

---

## 7. 公共组件

| 组件 | Props | 说明 |
|------|-------|------|
| `PageHeader` | `title`, `breadcrumb`, `extra` | 页面标题栏 + 面包屑 + 操作按钮 |
| `SearchForm` | `fields`, `onSearch`, `onReset` | 通用搜索表单，fields 定义筛选项 |
| `DataTable` | `columns`, `fetchData`, `rowKey` | 封装 Table + 分页 + loading + 空状态 + 操作列 |

### 典型 CRUD 模式

```
PageHeader(title: "成员信息管理", extra: [新增成员])
  SearchForm(fields: [姓名, 所属小组, 状态])
  DataTable(columns: [...], fetchFn: getMembers)
    Modal(新增/编辑表单)
```

---

## 8. 实现策略

**骨架优先（方案 A）**：

1. 项目脚手架 + 基础配置（Vite + Tailwind v4 + antd + router + zustand + axios）
2. 主布局框架（MainLayout + Sidebar + Header + 路由 Outlet）
3. 登录页 + authStore + AuthGuard + API 拦截器
4. 仪表盘页面
5. 公共组件（PageHeader / SearchForm / DataTable）
6. 各模块页面逐个填充（先 shell placeholder，再实现功能）

---

## 9. 数据监控大屏

- 嵌入 MainLayout 常规路由，与其他页面一致
- 页面内置"全屏"按钮，调用 Fullscreen API 切换浏览器全屏
- 使用 antd Charts 或 echarts 实现图表可视化

---

## 10. 约束与约定

- 每个页面一个 `index.tsx`，保持扁平
- API 接口按模块拆分到 `api/modules/` 下
- 所有页面用 antd 组件，TailwindCSS 仅做间距/颜色/布局微调
- 不引入 antd Pro 完整脚手架，只引入 ProLayout 组件
