from pydantic import BaseModel


class DashboardStats(BaseModel):
    knowledgeCount: int
    rankingCount: int
    memberCount: int
    logCount: int
