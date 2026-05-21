from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from models.common import ApiResponse, PageResult
from models.party import (
    PartyGroup, GroupCreate, GroupUpdate,
    PartyMember, MemberCreate, MemberUpdate,
    TransferRecord, TransferCreate,
)
from utils.security import get_current_user
from database import get_collection

router = APIRouter(prefix="/party", tags=["Party"])


def format_doc(doc, model):
    return model(**{k: v for k, v in doc.items() if k != "_id"})


# ─── Groups ───────────────────────────────────────────

@router.get("/groups/tree", response_model=ApiResponse[list[PartyGroup]])
async def get_group_tree(_current_user=Depends(get_current_user)):
    col = get_collection("party_groups")
    items = [format_doc(doc, PartyGroup) async for doc in col.find().sort("order", 1)]
    return ApiResponse(code=200, data=items, message="ok")


@router.post("/groups", response_model=ApiResponse[PartyGroup])
async def create_group(body: GroupCreate, _current_user=Depends(get_current_user)):
    col = get_collection("party_groups")
    last = await col.find_one({}, sort=[("id", -1)])
    new_id = str(int(last["id"]) + 1) if last else "1"
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    doc = body.model_dump()
    doc["id"] = new_id
    doc["memberCount"] = 0
    doc["createdAt"] = now
    await col.insert_one(doc)
    return ApiResponse(code=200, data=format_doc(doc, PartyGroup), message="创建成功")


@router.put("/groups/{group_id}", response_model=ApiResponse[PartyGroup])
async def update_group(group_id: str, body: GroupUpdate, _current_user=Depends(get_current_user)):
    col = get_collection("party_groups")
    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    result = await col.find_one_and_update({"id": group_id}, {"$set": update_data}, return_document=True)
    if result is None:
        raise HTTPException(status_code=404, detail="不存在")
    return ApiResponse(code=200, data=format_doc(result, PartyGroup), message="更新成功")


@router.delete("/groups/{group_id}", response_model=ApiResponse[None])
async def delete_group(group_id: str, _current_user=Depends(get_current_user)):
    col = get_collection("party_groups")
    result = await col.delete_one({"id": group_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="不存在")
    return ApiResponse(code=200, data=None, message="删除成功")


# ─── Members ──────────────────────────────────────────

@router.get("/members", response_model=ApiResponse[PageResult[PartyMember]])
async def list_members(
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    keyword: str = "",
    groupId: str = "",
    status: str = "",
    _current_user=Depends(get_current_user),
):
    col = get_collection("party_members")
    query = {}
    if keyword:
        query["name"] = {"$regex": keyword, "$options": "i"}
    if groupId:
        query["groupId"] = groupId
    if status:
        query["status"] = status

    total = await col.count_documents(query)
    cursor = col.find(query).skip((page - 1) * pageSize).limit(pageSize)
    items = [format_doc(doc, PartyMember) async for doc in cursor]
    return ApiResponse(
        code=200,
        data=PageResult(list=items, total=total, page=page, pageSize=pageSize),
        message="ok",
    )


@router.get("/members/all", response_model=ApiResponse[list[PartyMember]])
async def get_all_members(_current_user=Depends(get_current_user)):
    col = get_collection("party_members")
    items = [format_doc(doc, PartyMember) async for doc in col.find()]
    return ApiResponse(code=200, data=items, message="ok")


@router.post("/members", response_model=ApiResponse[PartyMember])
async def create_member(body: MemberCreate, _current_user=Depends(get_current_user)):
    col = get_collection("party_members")
    new_id = str(int(datetime.now(timezone.utc).timestamp() * 1000))
    doc = body.model_dump()
    doc["id"] = new_id
    await col.insert_one(doc)

    # Increment group member count
    groups_col = get_collection("party_groups")
    await groups_col.update_one({"id": doc["groupId"]}, {"$inc": {"memberCount": 1}})

    return ApiResponse(code=200, data=format_doc(doc, PartyMember), message="创建成功")


@router.put("/members/{member_id}", response_model=ApiResponse[PartyMember])
async def update_member(member_id: str, body: MemberUpdate, _current_user=Depends(get_current_user)):
    col = get_collection("party_members")
    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    result = await col.find_one_and_update({"id": member_id}, {"$set": update_data}, return_document=True)
    if result is None:
        raise HTTPException(status_code=404, detail="不存在")
    return ApiResponse(code=200, data=format_doc(result, PartyMember), message="更新成功")


@router.delete("/members/{member_id}", response_model=ApiResponse[None])
async def delete_member(member_id: str, _current_user=Depends(get_current_user)):
    col = get_collection("party_members")
    member = await col.find_one({"id": member_id})
    if member is None:
        raise HTTPException(status_code=404, detail="不存在")
    await col.delete_one({"id": member_id})

    # Decrement group member count
    groups_col = get_collection("party_groups")
    await groups_col.update_one({"id": member["groupId"]}, {"$inc": {"memberCount": -1}})

    return ApiResponse(code=200, data=None, message="删除成功")


# ─── Transfers ────────────────────────────────────────

@router.get("/transfers", response_model=ApiResponse[PageResult[TransferRecord]])
async def list_transfers(
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    keyword: str = "",
    _current_user=Depends(get_current_user),
):
    col = get_collection("transfers")
    query = {}
    if keyword:
        query["memberName"] = {"$regex": keyword, "$options": "i"}

    total = await col.count_documents(query)
    cursor = col.find(query).skip((page - 1) * pageSize).limit(pageSize).sort("transferDate", -1)
    items = [format_doc(doc, TransferRecord) async for doc in cursor]
    return ApiResponse(
        code=200,
        data=PageResult(list=items, total=total, page=page, pageSize=pageSize),
        message="ok",
    )


@router.post("/transfers", response_model=ApiResponse[TransferRecord])
async def create_transfer(body: TransferCreate, _current_user=Depends(get_current_user)):
    members_col = get_collection("party_members")
    groups_col = get_collection("party_groups")
    transfers_col = get_collection("transfers")

    member = await members_col.find_one({"id": body.memberId})
    if member is None:
        raise HTTPException(status_code=404, detail="成员不存在")

    to_group = await groups_col.find_one({"id": body.toGroupId})
    if to_group is None:
        raise HTTPException(status_code=404, detail="目标组织不存在")

    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    new_id = str(int(datetime.now(timezone.utc).timestamp() * 1000))

    transfer_doc = {
        "id": new_id,
        "memberId": body.memberId,
        "memberName": member["name"],
        "fromGroupId": member["groupId"],
        "fromGroupName": member["groupName"],
        "toGroupId": body.toGroupId,
        "toGroupName": to_group["name"],
        "reason": body.reason,
        "transferDate": now,
    }
    await transfers_col.insert_one(transfer_doc)

    # Update member
    await members_col.update_one(
        {"id": body.memberId},
        {"$set": {"groupId": body.toGroupId, "groupName": to_group["name"], "status": "transferred"}},
    )

    # Update group member counts
    await groups_col.update_one({"id": member["groupId"]}, {"$inc": {"memberCount": -1}})
    await groups_col.update_one({"id": body.toGroupId}, {"$inc": {"memberCount": 1}})

    return ApiResponse(code=200, data=TransferRecord(**transfer_doc), message="调动成功")
