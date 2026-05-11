import { Layout, Dropdown, Badge } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'
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

  const userMenuItems = [{ key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: handleLogout }]

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
