import { useState } from 'react'
import { Tag, Modal, message } from 'antd'
import { CloudUploadOutlined, ReloadOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import DataTable from '@/components/DataTable'
import { getBackupRecords, createBackup, restoreBackup, type BackupRecord } from '@/api/services/system'
import type { ColumnsType } from 'antd/es/table'

export default function BackupPage() {
  const [refresh, setRefresh] = useState(0)

  const columns: ColumnsType<BackupRecord> = [
    { title: '文件名', dataIndex: 'fileName', key: 'fileName', width: 250 },
    { title: '大小', dataIndex: 'size', key: 'size', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (s: string) => {
        const map: Record<string, string> = { success: '成功', failed: '失败', running: '进行中' }
        const colors: Record<string, string> = { success: 'green', failed: 'red', running: 'blue' }
        return <Tag color={colors[s]}>{map[s] || s}</Tag>
      },
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, r) =>
        r.status === 'success' ? (
          <a
            onClick={() => {
              Modal.confirm({
                title: '恢复数据',
                content: '确定从该备份恢复数据吗？当前数据将被覆盖。',
                onOk: async () => {
                  await restoreBackup(r.id)
                  message.success('恢复任务已启动')
                },
              })
            }}
          >
            恢复
          </a>
        ) : null,
    },
  ]

  const fetchData = (params: { page: number; pageSize: number }) => getBackupRecords(params).then((r) => r.data)

  const handleBackup = async () => {
    try {
      await createBackup()
      message.success('备份任务已启动')
      setRefresh((x) => x + 1)
    } catch {
      // 错误已在拦截器处理
    }
  }

  return (
    <div>
      <PageHeader
        title="数据备份与恢复"
        actions={[
          { label: '立即备份', type: 'primary', icon: <CloudUploadOutlined />, onClick: handleBackup },
          { label: '刷新', icon: <ReloadOutlined />, onClick: () => setRefresh((x) => x + 1) },
        ]}
      />
      <DataTable<BackupRecord> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} />
    </div>
  )
}
