import { Table } from 'antd'
import type { TablePaginationConfig, TableProps } from 'antd'
import { useState, useEffect } from 'react'

interface DataTableProps<T> {
  columns: TableProps<T>['columns']
  fetchData: (params: { page: number; pageSize: number }) => Promise<{ list: T[]; total: number }>
  rowKey?: string | ((record: T) => string)
  refreshFlag?: number
}

export default function DataTable<T>({ columns, fetchData, rowKey = 'id', refreshFlag = 0 }: DataTableProps<T>) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  const loadData = (page: number, pageSize: number) => {
    fetchData({ page, pageSize })
      .then((res) => {
        setData(res.list)
        setPagination((prev) => ({ ...prev, total: res.total }))
      })
      .catch(() => {
        // 错误已在拦截器处理
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData(1, 10)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag])

  const handleTableChange = (pag: TablePaginationConfig) => {
    const page = pag.current || 1
    const pageSize = pag.pageSize || 10
    setPagination((prev) => ({ ...prev, current: page, pageSize }))
    setLoading(true)
    loadData(page, pageSize)
  }

  return (
    <Table<T>
      columns={columns}
      dataSource={data}
      rowKey={rowKey}
      loading={loading}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
      }}
      onChange={handleTableChange}
      scroll={{ x: 'max-content' }}
    />
  )
}
