import { useState, useEffect } from 'react'
import { Modal, Form, Select, Input, message } from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import SearchForm, { type SearchField } from '@/components/SearchForm'
import DataTable from '@/components/DataTable'
import { getTransfers, transferMember, getAllMembers, getGroupTree, type TransferRecord } from '@/api/services/party'
import type { ColumnsType } from 'antd/es/table'

export default function TransfersPage() {
  const [searchParams, setSearchParams] = useState<Record<string, unknown>>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [memberOptions, setMemberOptions] = useState<{ label: string; value: string }[]>([])
  const [groupOptions, setGroupOptions] = useState<{ label: string; value: string }[]>([])
  const [form] = Form.useForm()

  const searchFields: SearchField[] = [{ name: 'keyword', label: '成员姓名', type: 'input' }]

  const columns: ColumnsType<TransferRecord> = [
    { title: '成员', dataIndex: 'memberName', key: 'memberName', width: 100 },
    { title: '调出小组', dataIndex: 'fromGroupName', key: 'fromGroupName', width: 150 },
    { title: '调入小组', dataIndex: 'toGroupName', key: 'toGroupName', width: 150 },
    { title: '调动原因', dataIndex: 'reason', key: 'reason', width: 200, ellipsis: true },
    { title: '调动日期', dataIndex: 'transferDate', key: 'transferDate', width: 120 },
  ]

  const fetchData = (params: { page: number; pageSize: number; [key: string]: unknown }) => {
    return getTransfers(params).then((r) => r.data)
  }

  const loadOptions = async () => {
    try {
      const [membersRes, groupsRes] = await Promise.all([getAllMembers(), getGroupTree()])
      setMemberOptions(
        membersRes.data.map((m) => ({
          label: `${m.name}（${m.groupName || '未分配'}）`,
          value: m.id,
        })),
      )
      setGroupOptions(
        groupsRes.data.map((g) => ({
          label: g.name,
          value: g.id,
        })),
      )
    } catch {
      // 错误已在拦截器处理
    }
  }

  useEffect(() => {
    Promise.all([getAllMembers(), getGroupTree()])
      .then(([membersRes, groupsRes]) => {
        setMemberOptions(
          membersRes.data.map((m) => ({
            label: `${m.name}（${m.groupName || '未分配'}）`,
            value: m.id,
          })),
        )
        setGroupOptions(
          groupsRes.data.map((g) => ({
            label: g.name,
            value: g.id,
          })),
        )
      })
      .catch(() => {})
  }, [])

  const handleSearch = (values: Record<string, unknown>) => {
    setSearchParams(values)
    setRefresh((r) => r + 1)
  }

  const handleReset = () => {
    setSearchParams({})
    setRefresh((r) => r + 1)
  }

  const handleTransfer = () => {
    form.resetFields()
    loadOptions()
    setModalOpen(true)
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      setConfirmLoading(true)
      await transferMember(values)
      message.success('调动成功')
      setModalOpen(false)
      setRefresh((x) => x + 1)
    } catch {
      // 表单校验失败
    } finally {
      setConfirmLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="成员调动与归属调整"
        actions={[
          {
            label: '新增调动',
            type: 'primary',
            icon: <SwapOutlined />,
            onClick: handleTransfer,
          },
        ]}
      />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable<TransferRecord> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} filterParams={searchParams} />
      <Modal
        title="新增调动"
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        confirmLoading={confirmLoading}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="memberId" label="选择成员" rules={[{ required: true, message: '请选择成员' }]}>
            <Select placeholder="请选择成员" showSearch optionFilterProp="label" options={memberOptions} />
          </Form.Item>
          <Form.Item name="toGroupId" label="调入小组" rules={[{ required: true, message: '请选择目标小组' }]}>
            <Select placeholder="请选择目标小组" showSearch optionFilterProp="label" options={groupOptions} />
          </Form.Item>
          <Form.Item name="reason" label="调动原因" rules={[{ required: true, message: '请输入调动原因' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
