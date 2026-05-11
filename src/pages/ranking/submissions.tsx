import { useState } from 'react'
import { Tag, Modal, message } from 'antd'
import PageHeader from '@/components/PageHeader'
import SearchForm, { type SearchField } from '@/components/SearchForm'
import DataTable from '@/components/DataTable'
import { getSubmissions, approveSubmission, rejectSubmission, type Submission } from '@/api/services/ranking'
import type { ColumnsType } from 'antd/es/table'

export default function SubmissionsPage() {
  const [refresh, setRefresh] = useState(0)

  const searchFields: SearchField[] = [
    { name: 'keyword', label: '标题/作者', type: 'input' },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      options: [
        { label: '待审核', value: 'pending' },
        { label: '已通过', value: 'approved' },
        { label: '已驳回', value: 'rejected' },
      ],
    },
  ]

  const columns: ColumnsType<Submission> = [
    { title: '作品标题', dataIndex: 'title', key: 'title', width: 200, ellipsis: true },
    { title: '作者', dataIndex: 'author', key: 'author', width: 120 },
    { title: '所属分类', dataIndex: 'categoryName', key: 'categoryName', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (s: string) => {
        const map: Record<string, { color: string; label: string }> = {
          pending: { color: 'orange', label: '待审核' },
          approved: { color: 'green', label: '已通过' },
          rejected: { color: 'red', label: '已驳回' },
        }
        return <Tag color={map[s]?.color}>{map[s]?.label || s}</Tag>
      },
    },
    { title: '投票数', dataIndex: 'voteCount', key: 'voteCount', width: 80 },
    { title: '投稿时间', dataIndex: 'submittedAt', key: 'submittedAt', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, r) => (
        <div style={{ display: 'flex', gap: 8 }}>
          {r.status === 'pending' && (
            <>
              <a
                onClick={async () => {
                  await approveSubmission(r.id)
                  message.success('已通过')
                  setRefresh((x) => x + 1)
                }}
              >
                通过
              </a>
              <a
                style={{ color: '#e74c3c' }}
                onClick={() => {
                  Modal.confirm({
                    title: '驳回作品',
                    content: '确定驳回该作品吗？',
                    onOk: async () => {
                      await rejectSubmission(r.id)
                      message.success('已驳回')
                      setRefresh((x) => x + 1)
                    },
                  })
                }}
              >
                驳回
              </a>
            </>
          )}
          <a>查看详情</a>
        </div>
      ),
    },
  ]

  const fetchData = (params: { page: number; pageSize: number }) => getSubmissions(params).then((r) => r.data)

  return (
    <div>
      <PageHeader title="作品投稿管理" />
      <SearchForm
        fields={searchFields}
        onSearch={() => setRefresh((x) => x + 1)}
        onReset={() => setRefresh((x) => x + 1)}
      />
      <DataTable<Submission> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} />
    </div>
  )
}
