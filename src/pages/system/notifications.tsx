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
    {
      title: '通知类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (t: string) => <Tag>{t === 'email' ? '邮件' : t === 'sms' ? '短信' : 'Webhook'}</Tag>,
    },
    { title: '触发事件', dataIndex: 'event', key: 'event', width: 180 },
    { title: '接收人', dataIndex: 'recipients', key: 'recipients', width: 200 },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (_: boolean, r: NotificationConfig) => (
        <Switch
          checked={r.enabled}
          onChange={async (checked) => {
            await updateNotificationConfig(r.id, { enabled: checked })
            message.success(checked ? '已启用' : '已禁用')
            setRefresh((x) => x + 1)
          }}
        />
      ),
    },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, r) => (
        <a
          onClick={() => {
            setEditing(r)
            form.setFieldsValue(r)
            setModalOpen(true)
          }}
        >
          编辑
        </a>
      ),
    },
  ]

  const fetchData = (params: { page: number; pageSize: number }) => getNotificationConfigs(params).then((r) => r.data)

  const handleModalOk = async () => {
    const values = await form.validateFields()
    if (editing) {
      await updateNotificationConfig(editing.id, values)
      message.success('更新成功')
    }
    setModalOpen(false)
    setRefresh((x) => x + 1)
  }

  return (
    <div>
      <PageHeader title="消息通知配置" />
      <DataTable<NotificationConfig> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} />
      <Modal title="编辑通知配置" open={modalOpen} onOk={handleModalOk} onCancel={() => setModalOpen(false)}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="type" label="通知类型">
            <Select
              options={[
                { label: '邮件', value: 'email' },
                { label: '短信', value: 'sms' },
                { label: 'Webhook', value: 'webhook' },
              ]}
            />
          </Form.Item>
          <Form.Item name="event" label="触发事件">
            <Input />
          </Form.Item>
          <Form.Item name="recipients" label="接收人">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
