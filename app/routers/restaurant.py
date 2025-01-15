from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from models.delivery import Restaurant, Dish, DishCategory
from dependencies import get_async_session

restaurant_router = APIRouter(
    prefix="/restaurants",
    tags=["Restaurants"]
)

# Lấy tất cả các nhà hàng
@restaurant_router.get("/")
async def get_all_restaurants(session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(Restaurant))
    restaurants = result.scalars().all()
    return restaurants

# Lấy thông tin chi tiết về một nhà hàng
@restaurant_router.get("/{restaurant_id}")
async def get_restaurant_by_id(restaurant_id: int, session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(
        select(Restaurant)
        .options(joinedload(Restaurant.dishes))
        .where(Restaurant.id == restaurant_id)
    )
    restaurant = result.scalars().first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found.")
    return restaurant

# Lấy danh mục món ăn của một nhà hàng
@restaurant_router.get("/{restaurant_id}/categories")
async def get_categories_by_restaurant(restaurant_id: int, session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(
        select(DishCategory)
        .join(Dish)
        .where(Dish.restaurant_id == restaurant_id)
    )
    categories = result.scalars().unique().all()
    return categories


# Lấy tất cả món ăn theo danh mục
@restaurant_router.get("/{restaurant_id}/categories/{category_id}/dishes")
async def get_dishes_by_category(
    restaurant_id: int,
    category_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(
        select(Dish)
        .where(Dish.category_id == category_id, Dish.restaurant_id == restaurant_id)
    )
    dishes = result.scalars().all()
    return dishes
