import { Card, Col, Row, Statistic } from 'antd'
import { BookOutlined, TrophyOutlined, TeamOutlined, FileTextOutlined } from '@ant-design/icons'
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
        <p style={{ color: '#999' }}>AI思政智能管理平台，提供知识库管理、锋云榜管理、党小组管理及系统管理等功能。</p>
      </Card>
    </div>
  )
}
