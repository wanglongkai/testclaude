import { useState } from 'react'
import { Tag, Modal, Form, Input, InputNumber, Select, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import SearchForm, { type SearchField } from '@/components/SearchForm'
import DataTable from '@/components/DataTable'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type RankingCategory,
} from '@/api/services/ranking'
import type { ColumnsType } from 'antd/es/table'

export default function CategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<RankingCategory | null>(null)
  const [refresh, setRefresh] = useState(0)
  const [form] = Form.useForm()

  const searchFields: SearchField[] = [{ name: 'keyword', label: '名称', type: 'input' }]

  const columns: ColumnsType<RankingCategory> = [
    { title: '排序', dataIndex: 'order', key: 'order', width: 80 },
    { title: '分类名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '描述', dataIndex: 'description', key: 'description', width: 300, ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s === 'active' ? '启用' : '禁用'}</Tag>,
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
                content: '确定删除该分类吗？',
                onOk: async () => {
                  await deleteCategory(r.id)
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

  const fetchData = (params: { page: number; pageSize: number }) => getCategories(params).then((r) => r.data)

  const handleAdd = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const handleModalOk = async () => {
    const values = await form.validateFields()
    if (editing) {
      await updateCategory(editing.id, values)
      message.success('更新成功')
    } else {
      await createCategory(values)
      message.success('创建成功')
    }
    setModalOpen(false)
    setRefresh((x) => x + 1)
  }

  return (
    <div>
      <PageHeader
        title="榜单分类管理"
        actions={[{ label: '新增分类', type: 'primary', icon: <PlusOutlined />, onClick: handleAdd }]}
      />
      <SearchForm
        fields={searchFields}
        onSearch={() => setRefresh((x) => x + 1)}
        onReset={() => setRefresh((x) => x + 1)}
      />
      <DataTable<RankingCategory> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} />
      <Modal
        title={editing ? '编辑分类' : '新增分类'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="分类名称" rules={[{ required: true, message: '请输入' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="order" label="排序" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select
              options={[
                { label: '启用', value: 'active' },
                { label: '禁用', value: 'inactive' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
