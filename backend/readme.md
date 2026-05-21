# 启动方式

cd backend
uv run python seed_data.py # 初始化种子数据(含 admin/admin123)
uv run uvicorn main:app --host 0.0.0.0 --port 8080
