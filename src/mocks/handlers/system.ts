import { http, HttpResponse, delay } from 'msw'

let userIdCounter = 10
let dictIdCounter = 10

const users = [
  {
    id: '1',
    username: 'admin',
    name: '系统管理员',
    role: 'admin' as const,
    status: 'active' as const,
    createdAt: '2026-01-01',
  },
  {
    id: '2',
    username: 'editor01',
    name: '张编辑',
    role: 'editor' as const,
    status: 'active' as const,
    createdAt: '2026-01-15',
  },
  {
    id: '3',
    username: 'viewer01',
    name: '李查阅',
    role: 'viewer' as const,
    status: 'active' as const,
    createdAt: '2026-02-01',
  },
  {
    id: '4',
    username: 'editor02',
    name: '王编辑',
    role: 'editor' as const,
    status: 'disabled' as const,
    createdAt: '2026-03-10',
  },
]

const notifications = [
  {
    id: '1',
    type: 'email' as const,
    event: '新成员加入通知',
    enabled: true,
    recipients: 'admin@example.com',
    updatedAt: '2026-04-01',
  },
  {
    id: '2',
    type: 'sms' as const,
    event: '重要公告通知',
    enabled: true,
    recipients: '138****0001',
    updatedAt: '2026-04-15',
  },
  {
    id: '3',
    type: 'webhook' as const,
    event: '数据变更通知',
    enabled: false,
    recipients: 'https://hooks.example.com/webhook',
    updatedAt: '2026-03-20',
  },
]

const backups = [
  {
    id: '1',
    fileName: 'aisizheng-backup-2026-05-08.zip',
    size: '256 MB',
    status: 'success' as const,
    createdAt: '2026-05-08 02:00:00',
  },
  {
    id: '2',
    fileName: 'aisizheng-backup-2026-05-07.zip',
    size: '248 MB',
    status: 'success' as const,
    createdAt: '2026-05-07 02:00:00',
  },
  {
    id: '3',
    fileName: 'aisizheng-backup-2026-05-06.zip',
    size: '250 MB',
    status: 'success' as const,
    createdAt: '2026-05-06 02:00:00',
  },
  {
    id: '4',
    fileName: 'aisizheng-backup-2026-05-05.zip',
    size: '0 MB',
    status: 'failed' as const,
    createdAt: '2026-05-05 02:00:00',
  },
]

const logs = [
  {
    id: '1',
    operator: 'admin',
    action: '新增',
    module: '知识库',
    detail: '新增资源"党史教育专题片"',
    ip: '192.168.1.100',
    createdAt: '2026-05-09 14:30:00',
  },
  {
    id: '2',
    operator: 'editor01',
    action: '编辑',
    module: '锋云榜',
    detail: '编辑榜单分类"理论学习"',
    ip: '192.168.1.101',
    createdAt: '2026-05-09 14:25:00',
  },
  {
    id: '3',
    operator: 'admin',
    action: '删除',
    module: '系统管理',
    detail: '删除用户"test_user"',
    ip: '192.168.1.100',
    createdAt: '2026-05-09 14:20:00',
  },
  {
    id: '4',
    operator: 'admin',
    action: '审核',
    module: '锋云榜',
    detail: '通过作品"社区网格化党建创新实践"',
    ip: '192.168.1.100',
    createdAt: '2026-05-09 14:15:00',
  },
  {
    id: '5',
    operator: 'editor02',
    action: '登录',
    module: '系统管理',
    detail: '用户登录系统',
    ip: '192.168.1.102',
    createdAt: '2026-05-09 14:10:00',
  },
  {
    id: '6',
    operator: 'admin',
    action: '备份',
    module: '系统管理',
    detail: '执行数据备份操作',
    ip: '192.168.1.100',
    createdAt: '2026-05-09 02:00:00',
  },
]

const dictionaryItems = [
  { id: '1', type: 'resource_type', label: '文档', value: 'document', order: 1, status: 'enabled' as const },
  { id: '2', type: 'resource_type', label: '视频', value: 'video', order: 2, status: 'enabled' as const },
  { id: '3', type: 'resource_type', label: '图片', value: 'image', order: 3, status: 'enabled' as const },
  { id: '4', type: 'resource_type', label: '音频', value: 'audio', order: 4, status: 'enabled' as const },
  { id: '5', type: 'member_status', label: '在职', value: 'active', order: 1, status: 'enabled' as const },
  { id: '6', type: 'member_status', label: '已调出', value: 'transferred', order: 2, status: 'enabled' as const },
  { id: '7', type: 'member_status', label: '离休', value: 'inactive', order: 3, status: 'enabled' as const },
]

const systemParams = [
  { id: '1', key: 'system.name', value: 'AI思政智能管理平台', description: '系统名称', updatedAt: '2026-01-01' },
  { id: '2', key: 'system.version', value: '1.0.0', description: '系统版本号', updatedAt: '2026-01-01' },
  { id: '3', key: 'upload.maxSize', value: '100', description: '上传文件最大大小(MB)', updatedAt: '2026-03-15' },
  {
    id: '4',
    key: 'upload.allowedTypes',
    value: 'jpg,png,mp4,doc,pdf',
    description: '允许上传的文件类型',
    updatedAt: '2026-03-15',
  },
  { id: '5', key: 'security.sessionTimeout', value: '30', description: '会话超时时间(分钟)', updatedAt: '2026-04-01' },
]

export const systemHandlers = [
  // Users
  http.get('/api/system/users', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = +(url.searchParams.get('page') || 1)
    const pageSize = +(url.searchParams.get('pageSize') || 10)
    const start = (page - 1) * pageSize
    return HttpResponse.json({
      code: 200,
      data: { list: users.slice(start, start + pageSize), total: users.length, page, pageSize },
      message: 'ok',
    })
  }),

  http.post('/api/system/users', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const newItem = {
      ...body,
      id: String(++userIdCounter),
      createdAt: new Date().toISOString().slice(0, 10),
    } as (typeof users)[0]
    users.unshift(newItem)
    return HttpResponse.json({ code: 200, data: newItem, message: '创建成功' })
  }),

  http.put('/api/system/users/:id', async ({ request, params }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const idx = users.findIndex((u) => u.id === params.id)
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...body } as (typeof users)[0]
      return HttpResponse.json({ code: 200, data: users[idx], message: '更新成功' })
    }
    return HttpResponse.json({ code: 404, data: null, message: '不存在' }, { status: 404 })
  }),

  http.delete('/api/system/users/:id', async ({ params }) => {
    await delay(200)
    const idx = users.findIndex((u) => u.id === params.id)
    if (idx !== -1) users.splice(idx, 1)
    return HttpResponse.json({ code: 200, data: null, message: '删除成功' })
  }),

  // Notifications
  http.get('/api/system/notifications', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = +(url.searchParams.get('page') || 1)
    const pageSize = +(url.searchParams.get('pageSize') || 10)
    const start = (page - 1) * pageSize
    return HttpResponse.json({
      code: 200,
      data: { list: notifications.slice(start, start + pageSize), total: notifications.length, page, pageSize },
      message: 'ok',
    })
  }),

  http.put('/api/system/notifications/:id', async ({ request, params }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const item = notifications.find((n) => n.id === params.id)
    if (item) {
      Object.assign(item, body, { updatedAt: new Date().toISOString().slice(0, 10) })
      return HttpResponse.json({ code: 200, data: item, message: '更新成功' })
    }
    return HttpResponse.json({ code: 404, data: null, message: '不存在' }, { status: 404 })
  }),

  // Backups
  http.get('/api/system/backups', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = +(url.searchParams.get('page') || 1)
    const pageSize = +(url.searchParams.get('pageSize') || 10)
    const start = (page - 1) * pageSize
    return HttpResponse.json({
      code: 200,
      data: { list: backups.slice(start, start + pageSize), total: backups.length, page, pageSize },
      message: 'ok',
    })
  }),

  http.post('/api/system/backups', async () => {
    await delay(1000)
    const newItem = {
      id: String(Date.now()),
      fileName: `aisizheng-backup-${new Date().toISOString().slice(0, 10)}.zip`,
      size: '252 MB',
      status: 'success' as const,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    }
    backups.unshift(newItem)
    return HttpResponse.json({ code: 200, data: newItem, message: '备份成功' })
  }),

  http.post('/api/system/backups/:id/restore', async ({ params }) => {
    await delay(1000)
    const item = backups.find((b) => b.id === params.id)
    return HttpResponse.json({ code: 200, data: item, message: '恢复任务已启动' })
  }),

  // Logs
  http.get('/api/system/logs', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = +(url.searchParams.get('page') || 1)
    const pageSize = +(url.searchParams.get('pageSize') || 10)
    const keyword = url.searchParams.get('keyword') || ''
    const module = url.searchParams.get('module') || ''
    let filtered = logs
    if (keyword) filtered = filtered.filter((l) => l.operator.includes(keyword) || l.detail.includes(keyword))
    if (module) filtered = filtered.filter((l) => l.module === module)
    const start = (page - 1) * pageSize
    return HttpResponse.json({
      code: 200,
      data: { list: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize },
      message: 'ok',
    })
  }),

  // Dictionary
  http.get('/api/system/dictionary', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = +(url.searchParams.get('page') || 1)
    const pageSize = +(url.searchParams.get('pageSize') || 10)
    const type = url.searchParams.get('type') || ''
    let filtered = dictionaryItems
    if (type) filtered = filtered.filter((d) => d.type === type)
    const start = (page - 1) * pageSize
    return HttpResponse.json({
      code: 200,
      data: { list: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize },
      message: 'ok',
    })
  }),

  http.post('/api/system/dictionary', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const newItem = { ...body, id: String(++dictIdCounter) } as (typeof dictionaryItems)[0]
    dictionaryItems.unshift(newItem)
    return HttpResponse.json({ code: 200, data: newItem, message: '创建成功' })
  }),

  http.put('/api/system/dictionary/:id', async ({ request, params }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const idx = dictionaryItems.findIndex((d) => d.id === params.id)
    if (idx !== -1) {
      dictionaryItems[idx] = { ...dictionaryItems[idx], ...body } as (typeof dictionaryItems)[0]
      return HttpResponse.json({ code: 200, data: dictionaryItems[idx], message: '更新成功' })
    }
    return HttpResponse.json({ code: 404, data: null, message: '不存在' }, { status: 404 })
  }),

  http.delete('/api/system/dictionary/:id', async ({ params }) => {
    await delay(200)
    const idx = dictionaryItems.findIndex((d) => d.id === params.id)
    if (idx !== -1) dictionaryItems.splice(idx, 1)
    return HttpResponse.json({ code: 200, data: null, message: '删除成功' })
  }),

  // System params
  http.get('/api/system/params', async () => {
    await delay(300)
    return HttpResponse.json({ code: 200, data: systemParams, message: 'ok' })
  }),

  http.put('/api/system/params/:id', async ({ request, params }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const item = systemParams.find((p) => p.id === params.id)
    if (item) {
      Object.assign(item, body, { updatedAt: new Date().toISOString().slice(0, 10) })
      return HttpResponse.json({ code: 200, data: item, message: '更新成功' })
    }
    return HttpResponse.json({ code: 404, data: null, message: '不存在' }, { status: 404 })
  }),
]
