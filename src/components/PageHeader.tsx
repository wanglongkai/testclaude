import { Button } from 'antd'

export interface PageHeaderAction {
  label: string
  type?: 'primary' | 'default'
  icon?: React.ReactNode
  onClick: () => void
}

interface PageHeaderProps {
  title: string
  actions?: PageHeaderAction[]
}

export default function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
      }}
    >
      <h2 style={{ margin: 0 }}>{title}</h2>
      {actions && actions.length > 0 && (
        <div style={{ display: 'flex', gap: 8 }}>
          {actions.map((action, i) => (
            <Button
              key={i}
              type={action.type === 'primary' ? 'primary' : 'default'}
              icon={action.icon}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
