from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import (
    auth_router,
    dashboard_router,
    knowledge_router,
    party_router,
    ranking_router,
    system_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title="AI思政智能管理平台", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(knowledge_router, prefix="/api")
app.include_router(party_router, prefix="/api")
app.include_router(ranking_router, prefix="/api")
app.include_router(system_router, prefix="/api")


@app.get("/api/health")
async def health():
    return {"status": "ok"}
