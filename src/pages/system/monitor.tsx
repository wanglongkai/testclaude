import { useState, useCallback, useEffect } from 'react'
import { Row, Col, Card, Statistic } from 'antd'
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons'
import ReactEChartsCore from 'echarts-for-react'
import PageHeader from '@/components/PageHeader'

export default function MonitorPage() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const trendOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['知识资源', '锋云榜作品', '新增成员'] },
    grid: { left: 50, right: 20, top: 30, bottom: 30 },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { type: 'value' },
    series: [
      {
        name: '知识资源',
        type: 'line',
        data: [120, 200, 280, 350, 420, 500],
        smooth: true,
        itemStyle: { color: '#1677ff' },
      },
      {
        name: '锋云榜作品',
        type: 'line',
        data: [80, 120, 160, 200, 260, 320],
        smooth: true,
        itemStyle: { color: '#52c41a' },
      },
      { name: '新增成员', type: 'line', data: [20, 30, 25, 40, 35, 50], smooth: true, itemStyle: { color: '#fa8c16' } },
    ],
  }

  const pieOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 420, name: '文档类', itemStyle: { color: '#1677ff' } },
          { value: 280, name: '视频类', itemStyle: { color: '#52c41a' } },
          { value: 180, name: '图片类', itemStyle: { color: '#fa8c16' } },
          { value: 120, name: '音频类', itemStyle: { color: '#e74c3c' } },
        ],
      },
    ],
  }

  const barOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['第一小组', '第二小组', '第三小组', '第四小组', '第五小组'] },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: [25, 18, 22, 15, 9],
        itemStyle: { color: '#1677ff', borderRadius: [4, 4, 0, 0] },
      },
    ],
  }

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [])

  return (
    <div>
      <PageHeader
        title="数据监控大屏"
        actions={[
          {
            label: isFullscreen ? '退出全屏' : '全屏展示',
            icon: isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />,
            onClick: toggleFullscreen,
          },
        ]}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="知识资源总量" value={1248} valueStyle={{ color: '#1677ff' }} suffix="条" />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="锋云榜作品" value={356} valueStyle={{ color: '#52c41a' }} suffix="件" />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="党小组成员" value={89} valueStyle={{ color: '#fa8c16' }} suffix="人" />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="今日访问量" value={1256} valueStyle={{ color: '#e74c3c' }} suffix="次" />
          </Card>
        </Col>
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
              <Card size="small" style={{ background: '#f6ffed' }}>
                CPU: <strong style={{ color: '#52c41a' }}>23%</strong>
              </Card>
              <Card size="small" style={{ background: '#f6ffed' }}>
                内存: <strong style={{ color: '#52c41a' }}>58%</strong>
              </Card>
              <Card size="small" style={{ background: '#f6ffed' }}>
                磁盘: <strong style={{ color: '#fa8c16' }}>72%</strong>
              </Card>
              <Card size="small" style={{ background: '#f6ffed' }}>
                运行: <strong style={{ color: '#52c41a' }}>128天</strong>
              </Card>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
