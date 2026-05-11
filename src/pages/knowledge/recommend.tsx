import { Card, Form, InputNumber, Select, Switch, message } from 'antd'
import PageHeader from '@/components/PageHeader'

export default function RecommendPage() {
  const [form] = Form.useForm()

  const handleSave = async () => {
    await form.validateFields()
    message.success('配置已保存')
  }

  return (
    <div>
      <PageHeader title="知识检索与推荐配置" actions={[{ label: '保存配置', type: 'primary', onClick: handleSave }]} />
      <Card style={{ maxWidth: 640 }}>
        <Form form={form} layout="vertical" initialValues={{ recallSize: 20, enableRecommend: true }}>
          <Form.Item name="enableRecommend" label="启用智能推荐" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="recallSize" label="检索召回数量">
            <InputNumber min={5} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="embedModel" label="嵌入模型">
            <Select
              options={[
                { label: 'text-embedding-v1', value: 'text-embedding-v1' },
                { label: 'text-embedding-v2', value: 'text-embedding-v2' },
              ]}
            />
          </Form.Item>
          <Form.Item name="rerankMode" label="重排序模式">
            <Select
              options={[
                { label: '语义相关性', value: 'semantic' },
                { label: '时间优先', value: 'time' },
                { label: '热度优先', value: 'hot' },
              ]}
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
