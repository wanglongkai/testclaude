import { useNavigate, useLocation } from 'react-router-dom'
import { Menu } from 'antd'
import {
  DashboardOutlined,
  BookOutlined,
  TrophyOutlined,
  TeamOutlined,
  SettingOutlined,
  ExperimentOutlined,
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
  {
    key: 'playground',
    icon: <ExperimentOutlined />,
    label: '练习场',
    children: [{ key: '/playground/threejs', label: 'Three.js 示例' }],
  },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const selectedKey = location.pathname
  const openKeys =
    location.pathname.split('/').filter(Boolean).length > 1 ? ['/' + location.pathname.split('/')[1]] : []

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
