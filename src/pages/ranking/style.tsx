import { useState } from 'react'
import { Tag, Modal, Form, Input, Select, message } from 'antd'
import PageHeader from '@/components/PageHeader'
import SearchForm, { type SearchField } from '@/components/SearchForm'
import DataTable from '@/components/DataTable'
import { getStyleContents, updateStyleContent, type StyleContent } from '@/api/services/ranking'
import type { ColumnsType } from 'antd/es/table'

export default function StylePage() {
  const [searchParams, setSearchParams] = useState<Record<string, unknown>>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<StyleContent | null>(null)
  const [refresh, setRefresh] = useState(0)
  const [form] = Form.useForm()

  const searchFields: SearchField[] = [
    { name: 'keyword', label: '用户名', type: 'input' },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      options: [
        { label: '已发布', value: 'published' },
        { label: '草稿', value: 'draft' },
      ],
    },
  ]

  const columns: ColumnsType<StyleContent> = [
    { title: '用户', dataIndex: 'userName', key: 'userName', width: 120 },
    { title: '内容摘要', dataIndex: 'content', key: 'content', width: 300, ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (s: string) => (
        <Tag color={s === 'published' ? 'green' : 'default'}>{s === 'published' ? '已发布' : '草稿'}</Tag>
      ),
    },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 120,
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

  const fetchData = (params: { page: number; pageSize: number; [key: string]: unknown }) =>
    getStyleContents(params).then((r) => r.data)

  const handleModalOk = async () => {
    const values = await form.validateFields()
    if (editing) {
      await updateStyleContent(editing.id, values)
      message.success('更新成功')
    }
    setModalOpen(false)
    setRefresh((x) => x + 1)
  }

  return (
    <div>
      <PageHeader title="配置个人风采内容" />
      <SearchForm
        fields={searchFields}
        onSearch={(values) => {
          setSearchParams(values)
          setRefresh((x) => x + 1)
        }}
        onReset={() => {
          setSearchParams({})
          setRefresh((x) => x + 1)
        }}
      />
      <DataTable<StyleContent> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} filterParams={searchParams} />
      <Modal
        title="编辑风采内容"
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        width={520}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="content" label="内容" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select
              options={[
                { label: '已发布', value: 'published' },
                { label: '草稿', value: 'draft' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
