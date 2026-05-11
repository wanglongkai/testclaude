/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import AuthGuard from './AuthGuard'
import LoginPage from '@/pages/login'
import DashboardPage from '@/pages/dashboard'

import { lazy, Suspense } from 'react'
import { Spin } from 'antd'

function LazyPage({ Page }: { Page: React.LazyExoticComponent<() => React.ReactNode> }) {
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
