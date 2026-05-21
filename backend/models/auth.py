from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class UserInfo(BaseModel):
    id: str
    username: str
    name: str
    avatar: str = ""
    role: str


class LoginResult(BaseModel):
    token: str
    user: UserInfo
