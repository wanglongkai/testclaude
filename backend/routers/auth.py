from fastapi import APIRouter, HTTPException
from models.auth import LoginRequest, LoginResult, UserInfo
from models.common import ApiResponse
from utils.security import verify_password, create_access_token
from database import get_collection

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=ApiResponse[LoginResult])
async def login(body: LoginRequest):
    users_col = get_collection("users")
    user = await users_col.find_one({"username": body.username})
    if user is None or not verify_password(body.password, user.get("password", "")):
        raise HTTPException(status_code=401, detail="用户名或密码错误")

    token = create_access_token({"sub": user["id"]})
    return ApiResponse(
        code=200,
        data=LoginResult(
            token=token,
            user=UserInfo(
                id=user["id"],
                username=user["username"],
                name=user["name"],
                avatar=user.get("avatar", ""),
                role=user["role"],
            ),
        ),
        message="登录成功",
    )
