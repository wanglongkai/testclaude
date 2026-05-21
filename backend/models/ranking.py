from typing import Optional
from pydantic import BaseModel


class RankingCategory(BaseModel):
    id: str
    name: str
    order: int
    status: str
    description: Optional[str] = None
    createdAt: str


class CategoryCreate(BaseModel):
    name: str
    order: int = 0
    status: str = "active"
    description: Optional[str] = None


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    order: Optional[int] = None
    status: Optional[str] = None
    description: Optional[str] = None


class Submission(BaseModel):
    id: str
    title: str
    author: str
    categoryId: str
    categoryName: str
    status: str
    voteCount: int
    submittedAt: str


class StyleContent(BaseModel):
    id: str
    userId: str
    userName: str
    content: str
    imageUrl: Optional[str] = None
    status: str
    updatedAt: str


class StyleUpdate(BaseModel):
    content: Optional[str] = None
    status: Optional[str] = None
    imageUrl: Optional[str] = None
