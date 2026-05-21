from typing import Generic, TypeVar, Optional
from pydantic import BaseModel

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    code: int = 200
    data: Optional[T] = None
    message: str = "ok"


class PageResult(BaseModel, Generic[T]):
    list: list[T]
    total: int
    page: int
    pageSize: int
