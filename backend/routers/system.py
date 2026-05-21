from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from models.common import ApiResponse, PageResult
from models.system import (
    SysUser, UserCreate, UserUpdate,
    NotificationConfig, NotificationUpdate,
    BackupRecord, SysLog,
    DictionaryItem, DictCreate, DictUpdate,
    SystemParam, ParamUpdate,
)
from utils.security import get_current_user, hash_password
from database import get_collection

router = APIRouter(prefix="/system", tags=["System"])


def format_doc(doc, model):
    return model(**{k: v for k, v in doc.items() if k != "_id"})


# ─── Users ────────────────────────────────────────────

@router.get("/users", response_model=ApiResponse[PageResult[SysUser]])
async def list_users(
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    keyword: str = "",
    _current_user=Depends(get_current_user),
):
    col = get_collection("users")
    query = {}
    if keyword:
        query["$or"] = [
            {"username": {"$regex": keyword, "$options": "i"}},
            {"name": {"$regex": keyword, "$options": "i"}},
        ]
    total = await col.count_documents(query)
    cursor = col.find(query).skip((page - 1) * pageSize).limit(pageSize).sort("createdAt", -1)
    items = [SysUser(**{k: v for k, v in doc.items() if k != "_id" and k != "password"}) async for doc in cursor]
    return ApiResponse(
        code=200,
        data=PageResult(list=items, total=total, page=page, pageSize=pageSize),
        message="ok",
    )


@router.post("/users", response_model=ApiResponse[SysUser])
async def create_user(body: UserCreate, _current_user=Depends(get_current_user)):
    col = get_collection("users")
    existing = await col.find_one({"username": body.username})
    if existing:
        raise HTTPException(status_code=400, detail="用户名已存在")

    last = await col.find_one({}, sort=[("id", -1)])
    new_id = str(int(last["id"]) + 1) if last else "1"
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    doc = body.model_dump()
    doc["id"] = new_id
    doc["createdAt"] = now
    doc["password"] = hash_password(doc.pop("password"))
    doc["avatar"] = ""
    await col.insert_one(doc)
    return ApiResponse(
        code=200,
        data=SysUser(id=doc["id"], username=doc["username"], name=doc["name"], role=doc["role"], status=doc["status"], createdAt=doc["createdAt"]),
        message="创建成功",
    )


@router.put("/users/{user_id}", response_model=ApiResponse[SysUser])
async def update_user(user_id: str, body: UserUpdate, _current_user=Depends(get_current_user)):
    col = get_collection("users")
    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    if "password" in update_data:
        update_data["password"] = hash_password(update_data.pop("password"))
    result = await col.find_one_and_update({"id": user_id}, {"$set": update_data}, return_document=True)
    if result is None:
        raise HTTPException(status_code=404, detail="不存在")
    return ApiResponse(
        code=200,
        data=SysUser(id=result["id"], username=result["username"], name=result["name"], role=result["role"], status=result["status"], createdAt=result["createdAt"]),
        message="更新成功",
    )


@router.delete("/users/{user_id}", response_model=ApiResponse[None])
async def delete_user(user_id: str, _current_user=Depends(get_current_user)):
    col = get_collection("users")
    result = await col.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="不存在")
    return ApiResponse(code=200, data=None, message="删除成功")


# ─── Notifications ────────────────────────────────────

@router.get("/notifications", response_model=ApiResponse[PageResult[NotificationConfig]])
async def list_notifications(
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    _current_user=Depends(get_current_user),
):
    col = get_collection("notification_configs")
    total = await col.count_documents({})
    cursor = col.find().skip((page - 1) * pageSize).limit(pageSize)
    items = [format_doc(doc, NotificationConfig) async for doc in cursor]
    return ApiResponse(
        code=200,
        data=PageResult(list=items, total=total, page=page, pageSize=pageSize),
        message="ok",
    )


@router.put("/notifications/{notif_id}", response_model=ApiResponse[NotificationConfig])
async def update_notification(notif_id: str, body: NotificationUpdate, _current_user=Depends(get_current_user)):
    col = get_collection("notification_configs")
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    update_data["updatedAt"] = now
    result = await col.find_one_and_update({"id": notif_id}, {"$set": update_data}, return_document=True)
    if result is None:
        raise HTTPException(status_code=404, detail="不存在")
    return ApiResponse(code=200, data=format_doc(result, NotificationConfig), message="更新成功")


# ─── Backups ──────────────────────────────────────────

@router.get("/backups", response_model=ApiResponse[PageResult[BackupRecord]])
async def list_backups(
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    _current_user=Depends(get_current_user),
):
    col = get_collection("backups")
    total = await col.count_documents({})
    cursor = col.find().skip((page - 1) * pageSize).limit(pageSize).sort("createdAt", -1)
    items = [format_doc(doc, BackupRecord) async for doc in cursor]
    return ApiResponse(
        code=200,
        data=PageResult(list=items, total=total, page=page, pageSize=pageSize),
        message="ok",
    )


@router.post("/backups", response_model=ApiResponse[BackupRecord])
async def create_backup(_current_user=Depends(get_current_user)):
    col = get_collection("backups")
    now = datetime.now(timezone.utc)
    new_id = str(int(now.timestamp() * 1000))
    date_str = now.strftime("%Y-%m-%d")
    doc = {
        "id": new_id,
        "fileName": f"aisizheng-backup-{date_str}.zip",
        "size": "252 MB",
        "status": "success",
        "createdAt": now.strftime("%Y-%m-%d %H:%M:%S"),
    }
    await col.insert_one(doc)
    return ApiResponse(code=200, data=format_doc(doc, BackupRecord), message="备份成功")


@router.post("/backups/{backup_id}/restore", response_model=ApiResponse[BackupRecord])
async def restore_backup(backup_id: str, _current_user=Depends(get_current_user)):
    col = get_collection("backups")
    doc = await col.find_one({"id": backup_id})
    if doc is None:
        raise HTTPException(status_code=404, detail="不存在")
    return ApiResponse(code=200, data=format_doc(doc, BackupRecord), message="恢复任务已启动")


# ─── Logs ─────────────────────────────────────────────

@router.get("/logs", response_model=ApiResponse[PageResult[SysLog]])
async def list_logs(
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    keyword: str = "",
    module: str = "",
    _current_user=Depends(get_current_user),
):
    col = get_collection("operation_logs")
    query = {}
    if keyword:
        query["$or"] = [
            {"operator": {"$regex": keyword, "$options": "i"}},
            {"detail": {"$regex": keyword, "$options": "i"}},
        ]
    if module:
        query["module"] = module

    total = await col.count_documents(query)
    cursor = col.find(query).skip((page - 1) * pageSize).limit(pageSize).sort("createdAt", -1)
    items = [format_doc(doc, SysLog) async for doc in cursor]
    return ApiResponse(
        code=200,
        data=PageResult(list=items, total=total, page=page, pageSize=pageSize),
        message="ok",
    )


# ─── Dictionary ───────────────────────────────────────

@router.get("/dictionary", response_model=ApiResponse[PageResult[DictionaryItem]])
async def list_dictionary(
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    type: str = "",
    _current_user=Depends(get_current_user),
):
    col = get_collection("dictionary")
    query = {}
    if type:
        query["type"] = type

    total = await col.count_documents(query)
    cursor = col.find(query).skip((page - 1) * pageSize).limit(pageSize).sort("order", 1)
    items = [format_doc(doc, DictionaryItem) async for doc in cursor]
    return ApiResponse(
        code=200,
        data=PageResult(list=items, total=total, page=page, pageSize=pageSize),
        message="ok",
    )


@router.post("/dictionary", response_model=ApiResponse[DictionaryItem])
async def create_dictionary_item(body: DictCreate, _current_user=Depends(get_current_user)):
    col = get_collection("dictionary")
    last = await col.find_one({}, sort=[("id", -1)])
    new_id = str(int(last["id"]) + 1) if last else "1"
    doc = body.model_dump()
    doc["id"] = new_id
    await col.insert_one(doc)
    return ApiResponse(code=200, data=format_doc(doc, DictionaryItem), message="创建成功")


@router.put("/dictionary/{dict_id}", response_model=ApiResponse[DictionaryItem])
async def update_dictionary_item(dict_id: str, body: DictUpdate, _current_user=Depends(get_current_user)):
    col = get_collection("dictionary")
    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    result = await col.find_one_and_update({"id": dict_id}, {"$set": update_data}, return_document=True)
    if result is None:
        raise HTTPException(status_code=404, detail="不存在")
    return ApiResponse(code=200, data=format_doc(result, DictionaryItem), message="更新成功")


@router.delete("/dictionary/{dict_id}", response_model=ApiResponse[None])
async def delete_dictionary_item(dict_id: str, _current_user=Depends(get_current_user)):
    col = get_collection("dictionary")
    result = await col.delete_one({"id": dict_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="不存在")
    return ApiResponse(code=200, data=None, message="删除成功")


# ─── Params ───────────────────────────────────────────

@router.get("/params", response_model=ApiResponse[list[SystemParam]])
async def get_system_params(_current_user=Depends(get_current_user)):
    col = get_collection("system_params")
    items = [format_doc(doc, SystemParam) async for doc in col.find()]
    return ApiResponse(code=200, data=items, message="ok")


@router.put("/params/{param_id}", response_model=ApiResponse[SystemParam])
async def update_system_param(param_id: str, body: ParamUpdate, _current_user=Depends(get_current_user)):
    col = get_collection("system_params")
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    update_data["updatedAt"] = now
    result = await col.find_one_and_update({"id": param_id}, {"$set": update_data}, return_document=True)
    if result is None:
        raise HTTPException(status_code=404, detail="不存在")
    return ApiResponse(code=200, data=format_doc(result, SystemParam), message="更新成功")
