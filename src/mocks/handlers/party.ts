import { http, HttpResponse, delay } from 'msw'

let groupIdCounter = 20

const groups = [
  {
    id: '1',
    name: '第一党小组',
    parentId: null,
    leaderName: '张建国',
    memberCount: 25,
    order: 1,
    createdAt: '2026-01-01',
  },
  {
    id: '2',
    name: '第二党小组',
    parentId: null,
    leaderName: '李为民',
    memberCount: 18,
    order: 2,
    createdAt: '2026-01-01',
  },
  {
    id: '3',
    name: '第三党小组',
    parentId: null,
    leaderName: '王振兴',
    memberCount: 22,
    order: 3,
    createdAt: '2026-01-01',
  },
  {
    id: '4',
    name: '第一党支部一小组',
    parentId: '1',
    leaderName: '陈志强',
    memberCount: 10,
    order: 1,
    createdAt: '2026-02-01',
  },
  {
    id: '5',
    name: '第一党支部二小组',
    parentId: '1',
    leaderName: '刘卫东',
    memberCount: 8,
    order: 2,
    createdAt: '2026-02-01',
  },
  {
    id: '6',
    name: '第一党支部三小组',
    parentId: '1',
    leaderName: '赵文博',
    memberCount: 7,
    order: 3,
    createdAt: '2026-02-01',
  },
  {
    id: '7',
    name: '第二党支部一小组',
    parentId: '2',
    leaderName: '孙国栋',
    memberCount: 9,
    order: 1,
    createdAt: '2026-02-01',
  },
  {
    id: '8',
    name: '第二党支部二小组',
    parentId: '2',
    leaderName: '周建华',
    memberCount: 9,
    order: 2,
    createdAt: '2026-02-01',
  },
]

const members = [
  {
    id: '1',
    name: '张建国',
    groupId: '1',
    groupName: '第一党小组',
    position: '组长',
    joinDate: '2005-07-01',
    phone: '13800001001',
    status: 'active' as const,
  },
  {
    id: '2',
    name: '李为民',
    groupId: '2',
    groupName: '第二党小组',
    position: '组长',
    joinDate: '2008-05-15',
    phone: '13800001002',
    status: 'active' as const,
  },
  {
    id: '3',
    name: '陈志强',
    groupId: '4',
    groupName: '第一党支部一小组',
    position: '副组长',
    joinDate: '2010-10-01',
    phone: '13800001003',
    status: 'active' as const,
  },
  {
    id: '4',
    name: '刘明辉',
    groupId: '4',
    groupName: '第一党支部一小组',
    position: '组员',
    joinDate: '2015-07-01',
    phone: '13800001004',
    status: 'active' as const,
  },
  {
    id: '5',
    name: '赵文博',
    groupId: '6',
    groupName: '第一党支部三小组',
    position: '副组长',
    joinDate: '2012-06-15',
    phone: '13800001005',
    status: 'active' as const,
  },
  {
    id: '6',
    name: '孙国栋',
    groupId: '7',
    groupName: '第二党支部一小组',
    position: '副组长',
    joinDate: '2011-03-20',
    phone: '13800001006',
    status: 'active' as const,
  },
  {
    id: '7',
    name: '周建华',
    groupId: '8',
    groupName: '第二党支部二小组',
    position: '副组长',
    joinDate: '2009-12-01',
    phone: '13800001007',
    status: 'transferred' as const,
  },
  {
    id: '8',
    name: '吴爱民',
    groupId: '3',
    groupName: '第三党小组',
    position: '组员',
    joinDate: '2018-07-01',
    phone: '13800001008',
    status: 'active' as const,
  },
  {
    id: '9',
    name: '郑海峰',
    groupId: '5',
    groupName: '第一党支部二小组',
    position: '组员',
    joinDate: '2020-01-10',
    phone: '13800001009',
    status: 'active' as const,
  },
]

const transfers = [
  {
    id: '1',
    memberId: '7',
    memberName: '周建华',
    fromGroupId: '8',
    fromGroupName: '第二党支部二小组',
    toGroupId: '7',
    toGroupName: '第二党支部一小组',
    reason: '工作需要',
    transferDate: '2026-03-15',
  },
]

let transferIdCounter = 10

export const partyHandlers = [
  // Group tree
  http.get('/api/party/groups/tree', async () => {
    await delay(300)
    return HttpResponse.json({ code: 200, data: groups, message: 'ok' })
  }),

  http.post('/api/party/groups', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const newItem = {
      ...body,
      id: String(++groupIdCounter),
      memberCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    } as (typeof groups)[0]
    groups.unshift(newItem)
    return HttpResponse.json({ code: 200, data: newItem, message: '创建成功' })
  }),

  http.put('/api/party/groups/:id', async ({ request, params }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const idx = groups.findIndex((g) => g.id === params.id)
    if (idx !== -1) {
      groups[idx] = { ...groups[idx], ...body } as (typeof groups)[0]
      return HttpResponse.json({ code: 200, data: groups[idx], message: '更新成功' })
    }
    return HttpResponse.json({ code: 404, data: null, message: '不存在' }, { status: 404 })
  }),

  http.delete('/api/party/groups/:id', async ({ params }) => {
    await delay(200)
    const idx = groups.findIndex((g) => g.id === params.id)
    if (idx !== -1) groups.splice(idx, 1)
    return HttpResponse.json({ code: 200, data: null, message: '删除成功' })
  }),

  // Members
  http.get('/api/party/members', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = +(url.searchParams.get('page') || 1)
    const pageSize = +(url.searchParams.get('pageSize') || 10)
    const keyword = url.searchParams.get('keyword') || ''
    const status = url.searchParams.get('status') || ''
    let filtered = members
    if (keyword) filtered = filtered.filter((m) => m.name.includes(keyword))
    if (status) filtered = filtered.filter((m) => m.status === status)
    const start = (page - 1) * pageSize
    return HttpResponse.json({
      code: 200,
      data: { list: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize },
      message: 'ok',
    })
  }),

  http.post('/api/party/members', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const newItem = { ...body, id: String(Date.now()) } as (typeof members)[0]
    members.unshift(newItem)
    return HttpResponse.json({ code: 200, data: newItem, message: '创建成功' })
  }),

  http.put('/api/party/members/:id', async ({ request, params }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const idx = members.findIndex((m) => m.id === params.id)
    if (idx !== -1) {
      members[idx] = { ...members[idx], ...body } as (typeof members)[0]
      return HttpResponse.json({ code: 200, data: members[idx], message: '更新成功' })
    }
    return HttpResponse.json({ code: 404, data: null, message: '不存在' }, { status: 404 })
  }),

  http.delete('/api/party/members/:id', async ({ params }) => {
    await delay(200)
    const idx = members.findIndex((m) => m.id === params.id)
    if (idx !== -1) members.splice(idx, 1)
    return HttpResponse.json({ code: 200, data: null, message: '删除成功' })
  }),

  // Transfers
  http.get('/api/party/transfers', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = +(url.searchParams.get('page') || 1)
    const pageSize = +(url.searchParams.get('pageSize') || 10)
    const start = (page - 1) * pageSize
    return HttpResponse.json({
      code: 200,
      data: { list: transfers.slice(start, start + pageSize), total: transfers.length, page, pageSize },
      message: 'ok',
    })
  }),

  http.post('/api/party/transfers', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as { memberId: string; toGroupId: string; reason: string }
    const member = members.find((m) => m.id === body.memberId)
    const toGroup = groups.find((g) => g.id === body.toGroupId)
    const newItem = {
      id: String(++transferIdCounter),
      memberId: body.memberId,
      memberName: member?.name || '未知',
      fromGroupId: member?.groupId || '',
      fromGroupName: member?.groupName || '',
      toGroupId: body.toGroupId,
      toGroupName: toGroup?.name || '',
      reason: body.reason,
      transferDate: new Date().toISOString().slice(0, 10),
    }
    transfers.unshift(newItem)
    if (member) {
      member.groupId = body.toGroupId
      member.groupName = toGroup?.name || ''
      member.status = 'transferred'
    }
    return HttpResponse.json({ code: 200, data: newItem, message: '调动成功' })
  }),
]
