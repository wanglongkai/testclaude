import { useState } from 'react'
import { Tag, Modal, Form, Input, Select, DatePicker, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import SearchForm, { type SearchField } from '@/components/SearchForm'
import DataTable from '@/components/DataTable'
import { getMembers, createMember, updateMember, deleteMember, type PartyMember } from '@/api/services/party'
import type { ColumnsType } from 'antd/es/table'

const statusOptions = [
  { label: '在职', value: 'active' },
  { label: '已调出', value: 'transferred' },
  { label: '离休', value: 'inactive' },
]

export default function MembersPage() {
  const [searchParams, setSearchParams] = useState<Record<string, unknown>>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<PartyMember | null>(null)
  const [refresh, setRefresh] = useState(0)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()

  const searchFields: SearchField[] = [
    { name: 'keyword', label: '姓名', type: 'input' },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      options: statusOptions,
    },
  ]

  const columns: ColumnsType<PartyMember> = [
    { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
    { title: '所属小组', dataIndex: 'groupName', key: 'groupName', width: 150 },
    { title: '职务', dataIndex: 'position', key: 'position', width: 120 },
    { title: '入党日期', dataIndex: 'joinDate', key: 'joinDate', width: 120 },
    { title: '电话', dataIndex: 'phone', key: 'phone', width: 140 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
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
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, r) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <a onClick={() => handleEdit(r)}>编辑</a>
          <a style={{ color: '#e74c3c' }} onClick={() => handleDelete(r.id)}>
            删除
          </a>
        </div>
      ),
    },
  ]

  const fetchData = (params: { page: number; pageSize: number; [key: string]: unknown }) => {
    return getMembers(params).then((r) => r.data)
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

  const handleEdit = (record: PartyMember) => {
    setEditing(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定删除该成员吗？',
      onOk: async () => {
        await deleteMember(id)
        message.success('已删除')
        setRefresh((x) => x + 1)
      },
    })
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      if (values.joinDate) {
        values.joinDate = values.joinDate.format('YYYY-MM-DD')
      }
      setConfirmLoading(true)
      if (editing) {
        await updateMember(editing.id, values)
        message.success('更新成功')
      } else {
        await createMember(values)
        message.success('创建成功')
      }
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
        title="成员信息管理"
        actions={[
          {
            label: '新增成员',
            type: 'primary',
            icon: <PlusOutlined />,
            onClick: handleAdd,
          },
        ]}
      />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable<PartyMember> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} filterParams={searchParams} />
      <Modal
        title={editing ? '编辑成员' : '新增成员'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        confirmLoading={confirmLoading}
        width={520}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="groupId" label="所属小组">
            <Input placeholder="请输入所属小组" />
          </Form.Item>
          <Form.Item name="position" label="职务">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="电话">
            <Input />
          </Form.Item>
          <Form.Item name="joinDate" label="入党日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select options={statusOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
