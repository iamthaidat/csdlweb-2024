from fastapi import FastAPI
from pydantic import BaseModel
from sqladmin import Admin, ModelView
from starlette.middleware.cors import CORSMiddleware

from auth.database import engine
from models.delivery import User, Role, Courier, Restaurant, Dish, Order, OrderStatus, Cart
from routers.courier import courier_router
from routers.courier_worker import courier_worker_router
from routers.users import router as auth_router
from routers.delivery import router as delivery_router
from routers.admin import admin_router
from routers.kitchen_worker import kitchen_worker_router
from settings.fastapi_settings import fastapi_settings
import logging
#from routers.restaurant import restaurant_router
from fastapi.staticfiles import StaticFiles
app = FastAPI(
    title="Food delivery"
)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(courier_worker_router)
app.include_router(auth_router)
app.include_router(delivery_router)
app.include_router(admin_router)
app.include_router(kitchen_worker_router)
app.include_router(courier_router)
#app.include_router(restaurant_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Cấu hình logger
logging.basicConfig(
    level=logging.DEBUG,  # Ghi toàn bộ log (DEBUG, INFO, ERROR)
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    filename="app.log",  # Tên file log
    filemode="w",  # Ghi đè log mỗi lần khởi chạy
)

# Thêm logger cho FastAPI và Uvicorn
logger = logging.getLogger("uvicorn.error")
logger.setLevel(logging.DEBUG)

# Ghi log lỗi từ FastAPI
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])
logging.getLogger("uvicorn.access").setLevel(logging.DEBUG)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=fastapi_settings.host, port=fastapi_settings.port)
