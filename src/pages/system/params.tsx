import { useEffect, useState } from 'react'
import { Card, Form, Input, Spin, message } from 'antd'
import PageHeader from '@/components/PageHeader'
import { getSystemParams, updateSystemParam, type SystemParam } from '@/api/services/system'

export default function ParamsPage() {
  const [params, setParams] = useState<SystemParam[]>([])
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm()

  useEffect(() => {
    getSystemParams()
      .then((res) => {
        setParams(res.data)
        const values: Record<string, string> = {}
        res.data.forEach((p) => {
          values[p.key] = p.value
        })
        form.setFieldsValue(values)
      })
      .finally(() => setLoading(false))
  }, [form])

  const handleSave = async () => {
    try {
      const values = form.getFieldsValue()
      await Promise.all(params.map((p) => updateSystemParam(p.id, { value: values[p.key] || p.value })))
      message.success('参数已保存')
    } catch {
      // error handled by request interceptor
    }
  }

  if (loading) return <Spin style={{ display: 'block', marginTop: 100 }} />

  return (
    <div>
      <PageHeader title="系统参数配置" actions={[{ label: '保存', type: 'primary', onClick: handleSave }]} />
      <Card style={{ maxWidth: 640 }}>
        <Form form={form} layout="vertical">
          {params.map((param) => (
            <Form.Item key={param.id} name={param.key} label={param.key} extra={param.description}>
              <Input />
            </Form.Item>
          ))}
        </Form>
      </Card>
    </div>
  )
}
