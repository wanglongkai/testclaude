import { Form, Input, Select, Button } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'

export type SearchFieldType = 'input' | 'select'

export interface SearchField {
  name: string
  label: string
  type: SearchFieldType
  placeholder?: string
  options?: { label: string; value: string | number }[]
}

interface SearchFormProps {
  fields: SearchField[]
  onSearch: (values: Record<string, unknown>) => void
  onReset?: () => void
}

export default function SearchForm({ fields, onSearch, onReset }: SearchFormProps) {
  const [form] = Form.useForm()

  const handleReset = () => {
    form.resetFields()
    onReset?.()
  }

  return (
    <Form form={form} layout="inline" onFinish={onSearch} style={{ marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
      {fields.map((field) => (
        <Form.Item key={field.name} name={field.name} label={field.label} style={{ marginBottom: 8 }}>
          {field.type === 'select' ? (
            <Select
              placeholder={field.placeholder || '请选择'}
              options={field.options}
              allowClear
              style={{ width: 160 }}
            />
          ) : (
            <Input placeholder={field.placeholder || '请输入'} allowClear style={{ width: 160 }} />
          )}
        </Form.Item>
      ))}
      <Form.Item style={{ marginBottom: 8 }}>
        <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
          搜索
        </Button>
      </Form.Item>
      <Form.Item style={{ marginBottom: 8 }}>
        <Button onClick={handleReset} icon={<ReloadOutlined />}>
          重置
        </Button>
      </Form.Item>
    </Form>
  )
}
