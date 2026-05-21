"""Seed the database with initial data matching frontend mocks."""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGODB_URL, DATABASE_NAME
from utils.security import hash_password


async def seed():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]

    # Clear existing data
    collections = [
        "users", "knowledge_resources", "party_groups", "party_members",
        "transfers", "ranking_categories", "submissions", "style_contents",
        "notification_configs", "backups", "operation_logs",
        "dictionary", "system_params",
    ]
    for name in collections:
        await db[name].delete_many({})

    # ── Users ──────────────────────────────────────────
    await db.users.insert_many([
        {"id": "1", "username": "admin", "name": "系统管理员", "role": "admin", "status": "active", "password": hash_password("admin123"), "avatar": "", "createdAt": "2026-01-01"},
        {"id": "2", "username": "editor01", "name": "张编辑", "role": "editor", "status": "active", "password": hash_password("editor123"), "avatar": "", "createdAt": "2026-01-15"},
        {"id": "3", "username": "viewer01", "name": "李查阅", "role": "viewer", "status": "active", "password": hash_password("viewer123"), "avatar": "", "createdAt": "2026-02-01"},
        {"id": "4", "username": "editor02", "name": "王编辑", "role": "editor", "status": "disabled", "password": hash_password("editor123"), "avatar": "", "createdAt": "2026-03-10"},
    ])

    # ── Knowledge Resources ────────────────────────────
    await db.knowledge_resources.insert_many([
        {"id": "1", "title": "习近平新时代中国特色社会主义思想学习纲要", "type": "document", "category": "理论文献", "author": "张三", "status": "published", "createdAt": "2026-01-15", "updatedAt": "2026-04-20"},
        {"id": "2", "title": "党史教育专题片：光辉历程", "type": "video", "category": "视频资源", "author": "李四", "status": "published", "createdAt": "2026-02-10", "updatedAt": "2026-03-05"},
        {"id": "3", "title": "党建工作流程图解", "type": "image", "category": "图解资源", "author": "王五", "status": "published", "createdAt": "2026-03-22", "updatedAt": "2026-03-22"},
        {"id": "4", "title": "基层党建经验交流录音", "type": "audio", "category": "音频资源", "author": "赵六", "status": "draft", "createdAt": "2026-04-01", "updatedAt": "2026-04-15"},
        {"id": "5", "title": "三会一课制度详解", "type": "document", "category": "制度文件", "author": "张三", "status": "published", "createdAt": "2026-04-18", "updatedAt": "2026-05-01"},
        {"id": "6", "title": "优秀党员事迹纪录片", "type": "video", "category": "视频资源", "author": "李四", "status": "archived", "createdAt": "2025-12-01", "updatedAt": "2026-01-10"},
        {"id": "7", "title": "党员发展流程图", "type": "image", "category": "图解资源", "author": "王五", "status": "published", "createdAt": "2026-05-02", "updatedAt": "2026-05-02"},
        {"id": "8", "title": "党的二十大精神解读", "type": "document", "category": "理论文献", "author": "张三", "status": "published", "createdAt": "2026-03-15", "updatedAt": "2026-03-15"},
        {"id": "9", "title": "主题党日活动策划方案", "type": "document", "category": "活动方案", "author": "赵六", "status": "draft", "createdAt": "2026-04-25", "updatedAt": "2026-05-05"},
    ])

    # ── Party Groups ───────────────────────────────────
    await db.party_groups.insert_many([
        {"id": "1", "name": "第一党小组", "parentId": None, "leaderName": "张建国", "memberCount": 25, "order": 1, "createdAt": "2026-01-01"},
        {"id": "2", "name": "第二党小组", "parentId": None, "leaderName": "李为民", "memberCount": 18, "order": 2, "createdAt": "2026-01-01"},
        {"id": "3", "name": "第三党小组", "parentId": None, "leaderName": "王振兴", "memberCount": 22, "order": 3, "createdAt": "2026-01-01"},
        {"id": "4", "name": "第一党支部一小组", "parentId": "1", "leaderName": "陈志强", "memberCount": 10, "order": 1, "createdAt": "2026-02-01"},
        {"id": "5", "name": "第一党支部二小组", "parentId": "1", "leaderName": "刘卫东", "memberCount": 8, "order": 2, "createdAt": "2026-02-01"},
        {"id": "6", "name": "第一党支部三小组", "parentId": "1", "leaderName": "赵文博", "memberCount": 7, "order": 3, "createdAt": "2026-02-01"},
        {"id": "7", "name": "第二党支部一小组", "parentId": "2", "leaderName": "孙国栋", "memberCount": 9, "order": 1, "createdAt": "2026-02-01"},
        {"id": "8", "name": "第二党支部二小组", "parentId": "2", "leaderName": "周建华", "memberCount": 9, "order": 2, "createdAt": "2026-02-01"},
    ])

    # ── Party Members ──────────────────────────────────
    await db.party_members.insert_many([
        {"id": "1", "name": "张建国", "groupId": "1", "groupName": "第一党小组", "position": "组长", "joinDate": "2005-07-01", "phone": "13800001001", "status": "active"},
        {"id": "2", "name": "李为民", "groupId": "2", "groupName": "第二党小组", "position": "组长", "joinDate": "2008-05-15", "phone": "13800001002", "status": "active"},
        {"id": "3", "name": "陈志强", "groupId": "4", "groupName": "第一党支部一小组", "position": "副组长", "joinDate": "2010-10-01", "phone": "13800001003", "status": "active"},
        {"id": "4", "name": "刘明辉", "groupId": "4", "groupName": "第一党支部一小组", "position": "组员", "joinDate": "2015-07-01", "phone": "13800001004", "status": "active"},
        {"id": "5", "name": "赵文博", "groupId": "6", "groupName": "第一党支部三小组", "position": "副组长", "joinDate": "2012-06-15", "phone": "13800001005", "status": "active"},
        {"id": "6", "name": "孙国栋", "groupId": "7", "groupName": "第二党支部一小组", "position": "副组长", "joinDate": "2011-03-20", "phone": "13800001006", "status": "active"},
        {"id": "7", "name": "周建华", "groupId": "8", "groupName": "第二党支部二小组", "position": "副组长", "joinDate": "2009-12-01", "phone": "13800001007", "status": "transferred"},
        {"id": "8", "name": "吴爱民", "groupId": "3", "groupName": "第三党小组", "position": "组员", "joinDate": "2018-07-01", "phone": "13800001008", "status": "active"},
        {"id": "9", "name": "郑海峰", "groupId": "5", "groupName": "第一党支部二小组", "position": "组员", "joinDate": "2020-01-10", "phone": "13800001009", "status": "active"},
    ])

    # ── Transfers ──────────────────────────────────────
    await db.transfers.insert_many([
        {"id": "1", "memberId": "7", "memberName": "周建华", "fromGroupId": "8", "fromGroupName": "第二党支部二小组", "toGroupId": "7", "toGroupName": "第二党支部一小组", "reason": "工作需要", "transferDate": "2026-03-15"},
    ])

    # ── Ranking Categories ─────────────────────────────
    await db.ranking_categories.insert_many([
        {"id": "1", "name": "理论学习", "order": 1, "status": "active", "description": "理论学习类作品", "createdAt": "2026-01-10"},
        {"id": "2", "name": "党建创新", "order": 2, "status": "active", "description": "党建工作创新案例", "createdAt": "2026-01-15"},
        {"id": "3", "name": "志愿服务", "order": 3, "status": "active", "description": "志愿服务活动记录", "createdAt": "2026-02-01"},
        {"id": "4", "name": "文化风采", "order": 4, "status": "inactive", "description": "文化活动展示", "createdAt": "2026-02-20"},
    ])

    # ── Submissions ────────────────────────────────────
    await db.submissions.insert_many([
        {"id": "1", "title": "社区网格化党建创新实践", "author": "张三", "categoryId": "2", "categoryName": "党建创新", "status": "pending", "voteCount": 0, "submittedAt": "2026-04-15"},
        {"id": "2", "title": "青年党员志愿服务队纪实", "author": "李四", "categoryId": "3", "categoryName": "志愿服务", "status": "approved", "voteCount": 128, "submittedAt": "2026-04-10"},
        {"id": "3", "title": "学习强国学习心得", "author": "王五", "categoryId": "1", "categoryName": "理论学习", "status": "approved", "voteCount": 256, "submittedAt": "2026-03-28"},
        {"id": "4", "title": "红色诗词书法作品集", "author": "赵六", "categoryId": "4", "categoryName": "文化风采", "status": "rejected", "voteCount": 0, "submittedAt": "2026-04-20"},
        {"id": "5", "title": "基层党支部标准化建设经验", "author": "孙七", "categoryId": "2", "categoryName": "党建创新", "status": "pending", "voteCount": 0, "submittedAt": "2026-05-01"},
    ])

    # ── Style Contents ─────────────────────────────────
    await db.style_contents.insert_many([
        {"id": "1", "userId": "1", "userName": "张三", "content": "扎根基层十余年，用实际行动践行党员初心使命...", "status": "published", "updatedAt": "2026-04-20"},
        {"id": "2", "userId": "2", "userName": "李四", "content": "带领青年志愿服务队开展帮扶活动百余次...", "status": "published", "updatedAt": "2026-04-18"},
        {"id": "3", "userId": "3", "userName": "王五", "content": "坚持理论学习，获评学习强国年度标兵...", "status": "draft", "updatedAt": "2026-05-02"},
    ])

    # ── Notifications ──────────────────────────────────
    await db.notification_configs.insert_many([
        {"id": "1", "type": "email", "event": "新成员加入通知", "enabled": True, "recipients": "admin@example.com", "updatedAt": "2026-04-01"},
        {"id": "2", "type": "sms", "event": "重要公告通知", "enabled": True, "recipients": "138****0001", "updatedAt": "2026-04-15"},
        {"id": "3", "type": "webhook", "event": "数据变更通知", "enabled": False, "recipients": "https://hooks.example.com/webhook", "updatedAt": "2026-03-20"},
    ])

    # ── Backups ────────────────────────────────────────
    await db.backups.insert_many([
        {"id": "1", "fileName": "aisizheng-backup-2026-05-08.zip", "size": "256 MB", "status": "success", "createdAt": "2026-05-08 02:00:00"},
        {"id": "2", "fileName": "aisizheng-backup-2026-05-07.zip", "size": "248 MB", "status": "success", "createdAt": "2026-05-07 02:00:00"},
        {"id": "3", "fileName": "aisizheng-backup-2026-05-06.zip", "size": "250 MB", "status": "success", "createdAt": "2026-05-06 02:00:00"},
        {"id": "4", "fileName": "aisizheng-backup-2026-05-05.zip", "size": "0 MB", "status": "failed", "createdAt": "2026-05-05 02:00:00"},
    ])

    # ── Operation Logs ─────────────────────────────────
    await db.operation_logs.insert_many([
        {"id": "1", "operator": "admin", "action": "新增", "module": "知识库", "detail": "新增资源\"党史教育专题片\"", "ip": "192.168.1.100", "createdAt": "2026-05-09 14:30:00"},
        {"id": "2", "operator": "editor01", "action": "编辑", "module": "锋云榜", "detail": "编辑榜单分类\"理论学习\"", "ip": "192.168.1.101", "createdAt": "2026-05-09 14:25:00"},
        {"id": "3", "operator": "admin", "action": "删除", "module": "系统管理", "detail": "删除用户\"test_user\"", "ip": "192.168.1.100", "createdAt": "2026-05-09 14:20:00"},
        {"id": "4", "operator": "admin", "action": "审核", "module": "锋云榜", "detail": "通过作品\"社区网格化党建创新实践\"", "ip": "192.168.1.100", "createdAt": "2026-05-09 14:15:00"},
        {"id": "5", "operator": "editor02", "action": "登录", "module": "系统管理", "detail": "用户登录系统", "ip": "192.168.1.102", "createdAt": "2026-05-09 14:10:00"},
        {"id": "6", "operator": "admin", "action": "备份", "module": "系统管理", "detail": "执行数据备份操作", "ip": "192.168.1.100", "createdAt": "2026-05-09 02:00:00"},
    ])

    # ── Dictionary ─────────────────────────────────────
    await db.dictionary.insert_many([
        {"id": "1", "type": "resource_type", "label": "文档", "value": "document", "order": 1, "status": "enabled"},
        {"id": "2", "type": "resource_type", "label": "视频", "value": "video", "order": 2, "status": "enabled"},
        {"id": "3", "type": "resource_type", "label": "图片", "value": "image", "order": 3, "status": "enabled"},
        {"id": "4", "type": "resource_type", "label": "音频", "value": "audio", "order": 4, "status": "enabled"},
        {"id": "5", "type": "member_status", "label": "在职", "value": "active", "order": 1, "status": "enabled"},
        {"id": "6", "type": "member_status", "label": "已调出", "value": "transferred", "order": 2, "status": "enabled"},
        {"id": "7", "type": "member_status", "label": "离休", "value": "inactive", "order": 3, "status": "enabled"},
    ])

    # ── System Params ──────────────────────────────────
    await db.system_params.insert_many([
        {"id": "1", "key": "system.name", "value": "AI思政智能管理平台", "description": "系统名称", "updatedAt": "2026-01-01"},
        {"id": "2", "key": "system.version", "value": "1.0.0", "description": "系统版本号", "updatedAt": "2026-01-01"},
        {"id": "3", "key": "upload.maxSize", "value": "100", "description": "上传文件最大大小(MB)", "updatedAt": "2026-03-15"},
        {"id": "4", "key": "upload.allowedTypes", "value": "jpg,png,mp4,doc,pdf", "description": "允许上传的文件类型", "updatedAt": "2026-03-15"},
        {"id": "5", "key": "security.sessionTimeout", "value": "30", "description": "会话超时时间(分钟)", "updatedAt": "2026-04-01"},
    ])

    print("Seed data inserted successfully!")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
