import { useState } from 'react'
import { Tag, Modal, Form, Input, Select, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import SearchForm, { type SearchField } from '@/components/SearchForm'
import DataTable from '@/components/DataTable'
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
  type KnowledgeResource,
  type KnowledgeSearchParams,
} from '@/api/services/knowledge'
import type { ColumnsType } from 'antd/es/table'

const typeOptions = [
  { label: '文档', value: 'document' },
  { label: '视频', value: 'video' },
  { label: '图片', value: 'image' },
  { label: '音频', value: 'audio' },
]

const statusOptions = [
  { label: '已发布', value: 'published' },
  { label: '草稿', value: 'draft' },
  { label: '已归档', value: 'archived' },
]

export default function ResourcesPage() {
  const [searchParams, setSearchParams] = useState<Record<string, unknown>>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<KnowledgeResource | null>(null)
  const [refresh, setRefresh] = useState(0)
  const [form] = Form.useForm()

  const searchFields: SearchField[] = [
    { name: 'keyword', label: '关键词', type: 'input', placeholder: '搜索标题' },
    { name: 'type', label: '资源类型', type: 'select', options: typeOptions },
    { name: 'status', label: '状态', type: 'select', options: statusOptions },
  ]

  const columns: ColumnsType<KnowledgeResource> = [
    { title: '标题', dataIndex: 'title', key: 'title', width: 200, ellipsis: true },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const map: Record<string, { color: string; label: string }> = {
          document: { color: 'blue', label: '文档' },
          video: { color: 'purple', label: '视频' },
          image: { color: 'green', label: '图片' },
          audio: { color: 'orange', label: '音频' },
        }
        return <Tag color={map[type]?.color}>{map[type]?.label || type}</Tag>
      },
    },
    { title: '分类', dataIndex: 'category', key: 'category', width: 120 },
    { title: '作者', dataIndex: 'author', key: 'author', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const map: Record<string, { color: string; label: string }> = {
          published: { color: 'green', label: '已发布' },
          draft: { color: 'default', label: '草稿' },
          archived: { color: 'red', label: '已归档' },
        }
        return <Tag color={map[status]?.color}>{map[status]?.label || status}</Tag>
      },
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a style={{ color: '#e74c3c' }} onClick={() => handleDelete(record.id)}>
            删除
          </a>
        </div>
      ),
    },
  ]

  const fetchData = (params: { page: number; pageSize: number; [key: string]: unknown }) => {
    return getResources(params as KnowledgeSearchParams).then((res) => res.data)
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

  const handleEdit = (record: KnowledgeResource) => {
    setEditing(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后不可恢复，确定删除该资源吗？',
      onOk: async () => {
        await deleteResource(id)
        message.success('删除成功')
        setRefresh((r) => r + 1)
      },
    })
  }

  const handleModalOk = async () => {
    const values = await form.validateFields()
    if (editing) {
      await updateResource(editing.id, values)
      message.success('更新成功')
    } else {
      await createResource(values)
      message.success('创建成功')
    }
    setModalOpen(false)
    setRefresh((r) => r + 1)
  }

  return (
    <div>
      <PageHeader
        title="多模态资源维护"
        actions={[{ label: '新增资源', type: 'primary', icon: <PlusOutlined />, onClick: handleAdd }]}
      />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable<KnowledgeResource> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} filterParams={searchParams} />
      <Modal
        title={editing ? '编辑资源' : '新增资源'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        width={520}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="资源类型" rules={[{ required: true, message: '请选择类型' }]}>
            <Select options={typeOptions} />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true, message: '请输入分类' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="author" label="作者">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select options={statusOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
