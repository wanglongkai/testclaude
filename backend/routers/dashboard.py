from fastapi import APIRouter, Depends
from models.common import ApiResponse
from models.dashboard import DashboardStats
from utils.security import get_current_user
from database import get_collection

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=ApiResponse[DashboardStats])
async def get_stats(_current_user=Depends(get_current_user)):
    return ApiResponse(
        code=200,
        data=DashboardStats(
            knowledgeCount=await get_collection("knowledge_resources").count_documents({}),
            rankingCount=await get_collection("submissions").count_documents({}),
            memberCount=await get_collection("party_members").count_documents({}),
            logCount=await get_collection("operation_logs").count_documents({}),
        ),
        message="ok",
    )
