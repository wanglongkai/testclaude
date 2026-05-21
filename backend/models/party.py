from typing import Optional
from pydantic import BaseModel


class PartyGroup(BaseModel):
    id: str
    name: str
    parentId: Optional[str] = None
    leaderName: str
    memberCount: int
    order: int
    createdAt: str


class GroupCreate(BaseModel):
    name: str
    parentId: Optional[str] = None
    leaderName: str = ""
    order: int = 0


class GroupUpdate(BaseModel):
    name: Optional[str] = None
    parentId: Optional[str] = None
    leaderName: Optional[str] = None
    order: Optional[int] = None


class PartyMember(BaseModel):
    id: str
    name: str
    groupId: str
    groupName: str
    position: str
    joinDate: str
    phone: str
    status: str


class MemberCreate(BaseModel):
    name: str
    groupId: str
    groupName: str = ""
    position: str = "组员"
    joinDate: str = ""
    phone: str = ""
    status: str = "active"


class MemberUpdate(BaseModel):
    name: Optional[str] = None
    groupId: Optional[str] = None
    groupName: Optional[str] = None
    position: Optional[str] = None
    joinDate: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = None


class TransferRecord(BaseModel):
    id: str
    memberId: str
    memberName: str
    fromGroupId: str
    fromGroupName: str
    toGroupId: str
    toGroupName: str
    reason: str
    transferDate: str


class TransferCreate(BaseModel):
    memberId: str
    toGroupId: str
    reason: str
