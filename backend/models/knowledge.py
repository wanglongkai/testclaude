from typing import Optional
from pydantic import BaseModel


class KnowledgeResource(BaseModel):
    id: str
    title: str
    type: str
    category: str
    author: str
    status: str
    createdAt: str
    updatedAt: str


class KnowledgeCreate(BaseModel):
    title: str
    type: str = "document"
    category: str = ""
    author: str = ""
    status: str = "draft"


class KnowledgeUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None
    status: Optional[str] = None
