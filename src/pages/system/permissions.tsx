import { useState } from 'react'
import { Tag, Modal, Form, Input, Select, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import SearchForm, { type SearchField } from '@/components/SearchForm'
import DataTable from '@/components/DataTable'
import { getUsers, createUser, updateUser, deleteUser, type SysUser } from '@/api/services/system'
import type { ColumnsType } from 'antd/es/table'

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '编辑者', value: 'editor' },
  { label: '查看者', value: 'viewer' },
]

export default function PermissionsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<SysUser | null>(null)
  const [refresh, setRefresh] = useState(0)
  const [form] = Form.useForm()

  const searchFields: SearchField[] = [{ name: 'keyword', label: '用户名/姓名', type: 'input' }]

  const columns: ColumnsType<SysUser> = [
    { title: '用户名', dataIndex: 'username', key: 'username', width: 120 },
    { title: '姓名', dataIndex: 'name', key: 'name', width: 120 },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => {
        const map: Record<string, { color: string; label: string }> = {
          admin: { color: 'red', label: '管理员' },
          editor: { color: 'blue', label: '编辑者' },
          viewer: { color: 'default', label: '查看者' },
        }
        return <Tag color={map[role]?.color}>{map[role]?.label || role}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (s: string) => <Tag color={s === 'active' ? 'green' : 'red'}>{s === 'active' ? '启用' : '禁用'}</Tag>,
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, r) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <a
            onClick={() => {
              setEditing(r)
              form.setFieldsValue(r)
              setModalOpen(true)
            }}
          >
            编辑
          </a>
          <a
            style={{ color: '#e74c3c' }}
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                onOk: async () => {
                  await deleteUser(r.id)
                  message.success('已删除')
                  setRefresh((x) => x + 1)
                },
              })
            }}
          >
            删除
          </a>
        </div>
      ),
    },
  ]

  const fetchData = (params: { page: number; pageSize: number }) => getUsers(params).then((r) => r.data)

  const handleAdd = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const handleModalOk = async () => {
    const values = await form.validateFields()
    if (editing) {
      await updateUser(editing.id, values)
      message.success('更新成功')
    } else {
      await createUser(values)
      message.success('创建成功')
    }
    setModalOpen(false)
    setRefresh((x) => x + 1)
  }

  return (
    <div>
      <PageHeader
        title="用户权限管理"
        actions={[{ label: '新增用户', type: 'primary', icon: <PlusOutlined />, onClick: handleAdd }]}
      />
      <SearchForm
        fields={searchFields}
        onSearch={() => setRefresh((x) => x + 1)}
        onReset={() => setRefresh((x) => x + 1)}
      />
      <DataTable<SysUser> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} />
      <Modal
        title={editing ? '编辑用户' : '新增用户'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          {!editing && (
            <Form.Item name="password" label="密码" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select options={roleOptions} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select
              options={[
                { label: '启用', value: 'active' },
                { label: '禁用', value: 'disabled' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
