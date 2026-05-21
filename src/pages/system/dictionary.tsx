import { useState } from 'react'
import { Tag, Modal, Form, Input, InputNumber, Select, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import SearchForm, { type SearchField } from '@/components/SearchForm'
import DataTable from '@/components/DataTable'
import {
  getDictionaryItems,
  createDictionaryItem,
  updateDictionaryItem,
  deleteDictionaryItem,
  type DictionaryItem,
} from '@/api/services/system'
import type { ColumnsType } from 'antd/es/table'

export default function DictionaryPage() {
  const [searchParams, setSearchParams] = useState<Record<string, unknown>>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<DictionaryItem | null>(null)
  const [refresh, setRefresh] = useState(0)
  const [form] = Form.useForm()

  const searchFields: SearchField[] = [{ name: 'type', label: '字典类型', type: 'input' }]

  const columns: ColumnsType<DictionaryItem> = [
    { title: '字典类型', dataIndex: 'type', key: 'type', width: 140 },
    { title: '标签', dataIndex: 'label', key: 'label', width: 140 },
    { title: '值', dataIndex: 'value', key: 'value', width: 140 },
    { title: '排序', dataIndex: 'order', key: 'order', width: 80 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (s: string) => (
        <Tag color={s === 'enabled' ? 'green' : 'default'}>{s === 'enabled' ? '启用' : '禁用'}</Tag>
      ),
    },
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
                  await deleteDictionaryItem(r.id)
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

  const fetchData = (params: { page: number; pageSize: number; [key: string]: unknown }) =>
    getDictionaryItems(params).then((r) => r.data)
  const handleAdd = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }
  const handleModalOk = async () => {
    const values = await form.validateFields()
    if (editing) {
      await updateDictionaryItem(editing.id, values)
      message.success('更新成功')
    } else {
      await createDictionaryItem(values)
      message.success('创建成功')
    }
    setModalOpen(false)
    setRefresh((x) => x + 1)
  }

  return (
    <div>
      <PageHeader
        title="数据字典管理"
        actions={[{ label: '新增字典项', type: 'primary', icon: <PlusOutlined />, onClick: handleAdd }]}
      />
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
      <DataTable<DictionaryItem> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} filterParams={searchParams} />
      <Modal
        title={editing ? '编辑字典项' : '新增字典项'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="type" label="字典类型" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="label" label="标签" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="value" label="值" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="order" label="排序">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select
              options={[
                { label: '启用', value: 'enabled' },
                { label: '禁用', value: 'disabled' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
