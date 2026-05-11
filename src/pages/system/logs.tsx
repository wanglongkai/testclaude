import { useState } from 'react'
import { Tag } from 'antd'
import PageHeader from '@/components/PageHeader'
import SearchForm, { type SearchField } from '@/components/SearchForm'
import DataTable from '@/components/DataTable'
import { getLogs, type SysLog } from '@/api/services/system'
import type { ColumnsType } from 'antd/es/table'

export default function LogsPage() {
  const [searchParams, setSearchParams] = useState<Record<string, unknown>>({})
  const [refresh, setRefresh] = useState(0)

  const searchFields: SearchField[] = [
    { name: 'keyword', label: '操作人/详情', type: 'input' },
    {
      name: 'module',
      label: '模块',
      type: 'select',
      options: [
        { label: '知识库', value: 'knowledge' },
        { label: '锋云榜', value: 'ranking' },
        { label: '党小组', value: 'party' },
        { label: '系统管理', value: 'system' },
      ],
    },
  ]

  const columns: ColumnsType<SysLog> = [
    { title: '操作人', dataIndex: 'operator', key: 'operator', width: 100 },
    { title: '操作', dataIndex: 'action', key: 'action', width: 80, render: (a: string) => <Tag>{a}</Tag> },
    { title: '模块', dataIndex: 'module', key: 'module', width: 100 },
    { title: '详情', dataIndex: 'detail', key: 'detail', width: 250, ellipsis: true },
    { title: 'IP', dataIndex: 'ip', key: 'ip', width: 140 },
    { title: '时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
  ]

  const fetchData = (params: { page: number; pageSize: number }) =>
    getLogs({ ...params, ...searchParams }).then((r) => r.data)

  return (
    <div>
      <PageHeader title="日志管理" />
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
      <DataTable<SysLog> columns={columns} fetchData={fetchData} rowKey="id" refreshFlag={refresh} />
    </div>
  )
}
