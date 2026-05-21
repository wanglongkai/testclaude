from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from models.common import ApiResponse, PageResult
from models.knowledge import KnowledgeResource, KnowledgeCreate, KnowledgeUpdate
from utils.security import get_current_user
from database import get_collection

router = APIRouter(prefix="/knowledge", tags=["Knowledge"])


def format_doc(doc) -> KnowledgeResource:
    doc["id"] = str(doc["id"]) if "_id" not in doc else doc["id"]
    return KnowledgeResource(**{k: v for k, v in doc.items() if k != "_id"})


@router.get("/resources", response_model=ApiResponse[PageResult[KnowledgeResource]])
async def list_resources(
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    keyword: str = "",
    type: str = "",
    status: str = "",
    _current_user=Depends(get_current_user),
):
    col = get_collection("knowledge_resources")
    query = {}
    if keyword:
        query["title"] = {"$regex": keyword, "$options": "i"}
    if type:
        query["type"] = type
    if status:
        query["status"] = status

    total = await col.count_documents(query)
    cursor = col.find(query).skip((page - 1) * pageSize).limit(pageSize).sort("createdAt", -1)
    items = [format_doc(doc) async for doc in cursor]
    return ApiResponse(
        code=200,
        data=PageResult(list=items, total=total, page=page, pageSize=pageSize),
        message="ok",
    )


@router.post("/resources", response_model=ApiResponse[KnowledgeResource])
async def create_resource(body: KnowledgeCreate, _current_user=Depends(get_current_user)):
    col = get_collection("knowledge_resources")
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    last = await col.find_one({}, sort=[("id", -1)])
    new_id = str(int(last["id"]) + 1) if last else "1"
    doc = body.model_dump()
    doc["id"] = new_id
    doc["createdAt"] = now
    doc["updatedAt"] = now
    await col.insert_one(doc)
    return ApiResponse(code=200, data=format_doc(doc), message="创建成功")


@router.put("/resources/{resource_id}", response_model=ApiResponse[KnowledgeResource])
async def update_resource(resource_id: str, body: KnowledgeUpdate, _current_user=Depends(get_current_user)):
    col = get_collection("knowledge_resources")
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    update_data["updatedAt"] = now
    result = await col.find_one_and_update(
        {"id": resource_id}, {"$set": update_data}, return_document=True
    )
    if result is None:
        raise HTTPException(status_code=404, detail="资源不存在")
    return ApiResponse(code=200, data=format_doc(result), message="更新成功")


@router.delete("/resources/{resource_id}", response_model=ApiResponse[None])
async def delete_resource(resource_id: str, _current_user=Depends(get_current_user)):
    col = get_collection("knowledge_resources")
    result = await col.delete_one({"id": resource_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="资源不存在")
    return ApiResponse(code=200, data=None, message="删除成功")
