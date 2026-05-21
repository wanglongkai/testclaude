from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from models.common import ApiResponse, PageResult
from models.ranking import (
    RankingCategory, CategoryCreate, CategoryUpdate,
    Submission, StyleContent, StyleUpdate,
)
from utils.security import get_current_user
from database import get_collection

router = APIRouter(prefix="/ranking", tags=["Ranking"])


def format_doc(doc, model):
    return model(**{k: v for k, v in doc.items() if k != "_id"})


# ─── Categories ───────────────────────────────────────

@router.get("/categories", response_model=ApiResponse[PageResult[RankingCategory]])
async def list_categories(
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    keyword: str = "",
    _current_user=Depends(get_current_user),
):
    col = get_collection("ranking_categories")
    query = {}
    if keyword:
        query["name"] = {"$regex": keyword, "$options": "i"}
    total = await col.count_documents(query)
    cursor = col.find(query).skip((page - 1) * pageSize).limit(pageSize).sort("order", 1)
    items = [format_doc(doc, RankingCategory) async for doc in cursor]
    return ApiResponse(
        code=200,
        data=PageResult(list=items, total=total, page=page, pageSize=pageSize),
        message="ok",
    )


@router.post("/categories", response_model=ApiResponse[RankingCategory])
async def create_category(body: CategoryCreate, _current_user=Depends(get_current_user)):
    col = get_collection("ranking_categories")
    last = await col.find_one({}, sort=[("id", -1)])
    new_id = str(int(last["id"]) + 1) if last else "1"
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    doc = body.model_dump()
    doc["id"] = new_id
    doc["createdAt"] = now
    await col.insert_one(doc)
    return ApiResponse(code=200, data=format_doc(doc, RankingCategory), message="创建成功")


@router.put("/categories/{cat_id}", response_model=ApiResponse[RankingCategory])
async def update_category(cat_id: str, body: CategoryUpdate, _current_user=Depends(get_current_user)):
    col = get_collection("ranking_categories")
    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    result = await col.find_one_and_update({"id": cat_id}, {"$set": update_data}, return_document=True)
    if result is None:
        raise HTTPException(status_code=404, detail="不存在")
    return ApiResponse(code=200, data=format_doc(result, RankingCategory), message="更新成功")


@router.delete("/categories/{cat_id}", response_model=ApiResponse[None])
async def delete_category(cat_id: str, _current_user=Depends(get_current_user)):
    col = get_collection("ranking_categories")
    result = await col.delete_one({"id": cat_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="不存在")
    return ApiResponse(code=200, data=None, message="删除成功")


# ─── Submissions ──────────────────────────────────────

@router.get("/submissions", response_model=ApiResponse[PageResult[Submission]])
async def list_submissions(
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    keyword: str = "",
    status: str = "",
    _current_user=Depends(get_current_user),
):
    col = get_collection("submissions")
    query = {}
    if keyword:
        query["$or"] = [
            {"title": {"$regex": keyword, "$options": "i"}},
            {"author": {"$regex": keyword, "$options": "i"}},
        ]
    if status:
        query["status"] = status

    total = await col.count_documents(query)
    cursor = col.find(query).skip((page - 1) * pageSize).limit(pageSize).sort("submittedAt", -1)
    items = [format_doc(doc, Submission) async for doc in cursor]
    return ApiResponse(
        code=200,
        data=PageResult(list=items, total=total, page=page, pageSize=pageSize),
        message="ok",
    )


@router.put("/submissions/{sub_id}/approve", response_model=ApiResponse[Submission])
async def approve_submission(sub_id: str, _current_user=Depends(get_current_user)):
    col = get_collection("submissions")
    result = await col.find_one_and_update(
        {"id": sub_id}, {"$set": {"status": "approved"}}, return_document=True
    )
    if result is None:
        raise HTTPException(status_code=404, detail="不存在")
    return ApiResponse(code=200, data=format_doc(result, Submission), message="已通过")


@router.put("/submissions/{sub_id}/reject", response_model=ApiResponse[Submission])
async def reject_submission(sub_id: str, _current_user=Depends(get_current_user)):
    col = get_collection("submissions")
    result = await col.find_one_and_update(
        {"id": sub_id}, {"$set": {"status": "rejected"}}, return_document=True
    )
    if result is None:
        raise HTTPException(status_code=404, detail="不存在")
    return ApiResponse(code=200, data=format_doc(result, Submission), message="已驳回")


# ─── Style Content ────────────────────────────────────

@router.get("/style", response_model=ApiResponse[PageResult[StyleContent]])
async def list_style_contents(
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    keyword: str = "",
    status: str = "",
    _current_user=Depends(get_current_user),
):
    col = get_collection("style_contents")
    query = {}
    if keyword:
        query["userName"] = {"$regex": keyword, "$options": "i"}
    if status:
        query["status"] = status
    total = await col.count_documents(query)
    cursor = col.find(query).skip((page - 1) * pageSize).limit(pageSize).sort("updatedAt", -1)
    items = [format_doc(doc, StyleContent) async for doc in cursor]
    return ApiResponse(
        code=200,
        data=PageResult(list=items, total=total, page=page, pageSize=pageSize),
        message="ok",
    )


@router.put("/style/{content_id}", response_model=ApiResponse[StyleContent])
async def update_style_content(content_id: str, body: StyleUpdate, _current_user=Depends(get_current_user)):
    col = get_collection("style_contents")
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    update_data["updatedAt"] = now
    result = await col.find_one_and_update({"id": content_id}, {"$set": update_data}, return_document=True)
    if result is None:
        raise HTTPException(status_code=404, detail="不存在")
    return ApiResponse(code=200, data=format_doc(result, StyleContent), message="更新成功")
