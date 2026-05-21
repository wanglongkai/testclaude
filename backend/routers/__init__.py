from routers.auth import router as auth_router
from routers.dashboard import router as dashboard_router
from routers.knowledge import router as knowledge_router
from routers.party import router as party_router
from routers.ranking import router as ranking_router
from routers.system import router as system_router

__all__ = [
    "auth_router",
    "dashboard_router",
    "knowledge_router",
    "party_router",
    "ranking_router",
    "system_router",
]
