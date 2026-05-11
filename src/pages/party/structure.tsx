import { useEffect, useState } from 'react'
import { Tree, Card, Modal, Form, Input, InputNumber, Button, message, Spin, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import { getGroupTree, createGroup, updateGroup, deleteGroup, type PartyGroup } from '@/api/services/party'
import type { DataNode } from 'antd/es/tree'

function buildTreeData(groups: PartyGroup[]): DataNode[] {
	const map = new Map<string, DataNode>()
	const roots: DataNode[] = []

	groups.forEach((g) => {
		map.set(g.id, {
			key: g.id,
			title: `${g.name}（组长: ${g.leaderName} | ${g.memberCount}人）`,
		})
	})

	groups.forEach((g) => {
		const node = map.get(g.id)!
		if (g.parentId && map.has(g.parentId)) {
			const parent = map.get(g.parentId)!
			if (!parent.children) parent.children = []
			parent.children.push(node)
		} else {
			roots.push(node)
		}
	})

	return roots
}

export default function StructurePage() {
	const [treeData, setTreeData] = useState<DataNode[]>([])
	const [groups, setGroups] = useState<PartyGroup[]>([])
	const [loading, setLoading] = useState(true)
	const [modalOpen, setModalOpen] = useState(false)
	const [editing, setEditing] = useState<PartyGroup | null>(null)
	const [parentId, setParentId] = useState<string | null>(null)
	const [confirmLoading, setConfirmLoading] = useState(false)
	const [form] = Form.useForm()

	const loadTree = async () => {
		try {
			const res = await getGroupTree()
			setGroups(res.data)
			setTreeData(buildTreeData(res.data))
		} catch {
			// 错误已在拦截器处理
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		getGroupTree()
			.then((res) => {
				setGroups(res.data)
				setTreeData(buildTreeData(res.data))
			})
			.catch(() => {})
			.finally(() => setLoading(false))
	}, [])

	const handleAdd = (parentId: string | null = null) => {
		setEditing(null)
		setParentId(parentId)
		form.resetFields()
		setModalOpen(true)
	}

	const handleEdit = (group: PartyGroup) => {
		setEditing(group)
		setParentId(null)
		form.setFieldsValue(group)
		setModalOpen(true)
	}

	const handleDelete = async (id: string) => {
		await deleteGroup(id)
		message.success('已删除')
		setLoading(true)
		loadTree()
	}

	const handleModalOk = async () => {
		try {
			const values = await form.validateFields()
			setConfirmLoading(true)
			if (editing) {
				await updateGroup(editing.id, values)
			} else {
				await createGroup({ ...values, parentId })
			}
			message.success(editing ? '更新成功' : '创建成功')
			setModalOpen(false)
			setLoading(true)
			loadTree()
		} catch {
			// 表单校验失败
		} finally {
			setConfirmLoading(false)
		}
	}

	return (
		<div>
			<PageHeader
				title="党小组组织架构管理"
				actions={[
					{
						label: '新增一级小组',
						type: 'primary',
						icon: <PlusOutlined />,
						onClick: () => handleAdd(null),
					},
				]}
			/>

			<Card
				title="组织架构树"
				extra={
					<Button size="small" onClick={() => { setLoading(true); loadTree() }}>
						刷新
					</Button>
				}
			>
				{loading ? (
					<Spin />
				) : (
					<Tree
						showLine
						defaultExpandAll
						treeData={treeData}
						titleRender={(node) => {
							const group = groups.find((g) => g.id === node.key)
							return (
								<div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
									<span>{node.title as string}</span>
									{group && (
										<span style={{ display: 'flex', gap: 4 }}>
											<Button
												size="small"
												type="link"
												icon={<PlusOutlined />}
												onClick={(e) => {
													e.stopPropagation()
													handleAdd(group.id)
												}}
											>
												添加子小组
											</Button>
											<Button
												size="small"
												type="link"
												icon={<EditOutlined />}
												onClick={(e) => {
													e.stopPropagation()
													handleEdit(group)
												}}
											>
												编辑
											</Button>
											<Popconfirm
												title="确定删除该小组吗？"
												onConfirm={(e) => {
													e?.stopPropagation()
													handleDelete(group.id)
												}}
												onCancel={(e) => e?.stopPropagation()}
											>
												<Button
													size="small"
													type="link"
													danger
													icon={<DeleteOutlined />}
													onClick={(e) => e.stopPropagation()}
												>
													删除
												</Button>
											</Popconfirm>
										</span>
									)}
								</div>
							)
						}}
					/>
				)}
			</Card>

			<Modal
				title={editing ? '编辑党小组' : '新增党小组'}
				open={modalOpen}
				onOk={handleModalOk}
				onCancel={() => setModalOpen(false)}
				confirmLoading={confirmLoading}
			>
				<Form form={form} layout="vertical" style={{ marginTop: 16 }}>
					<Form.Item name="name" label="小组名称" rules={[{ required: true, message: '请输入小组名称' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="leaderName" label="组长姓名" rules={[{ required: true, message: '请输入组长姓名' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="order" label="排序" rules={[{ required: true, message: '请输入排序号' }]}>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}
