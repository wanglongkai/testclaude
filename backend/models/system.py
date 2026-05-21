from typing import Optional
from pydantic import BaseModel


class SysUser(BaseModel):
    id: str
    username: str
    name: str
    role: str
    status: str
    createdAt: str


class UserCreate(BaseModel):
    username: str
    name: str
    password: str
    role: str = "viewer"
    status: str = "active"


class UserUpdate(BaseModel):
    username: Optional[str] = None
    name: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    password: Optional[str] = None


class NotificationConfig(BaseModel):
    id: str
    type: str
    event: str
    enabled: bool
    recipients: str
    updatedAt: str


class NotificationUpdate(BaseModel):
    type: Optional[str] = None
    event: Optional[str] = None
    enabled: Optional[bool] = None
    recipients: Optional[str] = None


class BackupRecord(BaseModel):
    id: str
    fileName: str
    size: str
    status: str
    createdAt: str


class SysLog(BaseModel):
    id: str
    operator: str
    action: str
    module: str
    detail: str
    ip: str
    createdAt: str


class DictionaryItem(BaseModel):
    id: str
    type: str
    label: str
    value: str
    order: int
    status: str


class DictCreate(BaseModel):
    type: str
    label: str
    value: str
    order: int = 0
    status: str = "enabled"


class DictUpdate(BaseModel):
    type: Optional[str] = None
    label: Optional[str] = None
    value: Optional[str] = None
    order: Optional[int] = None
    status: Optional[str] = None


class SystemParam(BaseModel):
    id: str
    key: str
    value: str
    description: str
    updatedAt: str


class ParamUpdate(BaseModel):
    key: Optional[str] = None
    value: Optional[str] = None
    description: Optional[str] = None
