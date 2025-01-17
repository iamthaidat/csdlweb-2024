from datetime import datetime, timedelta
from typing import List

import httpx
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy import text, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload
from pydantic import BaseModel
from auth.database import get_async_session
from config import YANDEX_API_KEY
from dependencies import get_current_user
from models.delivery import DishCategory, Dish, Customer, Cart, CartDishAssociation, OrderDishAssociation, Order, \
    OrderStatus, User
from schemas.cart import CartDishAddRequest
from schemas.delivery import DishSchema, DishCategorySchema, CartSchema, OrderSchema
from services.customer_service import update_customer_location_service, get_cart_with_dishes, calculate_order_details, \
    get_customer_with_balance_check, update_customer_balance, create_new_order, validate_current_user, \
    validate_request_data, get_or_create_cart, add_or_update_cart_dish
from utils.customer_location import get_coordinates_from_address

router = APIRouter(prefix="/api", tags=["api"])


@router.get("/dish-categories")
async def get_all_dish_categories(session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(DishCategory))
    categories = result.scalars().all()

    if not categories:
        raise HTTPException(status_code=404, detail="No dish categories found")

    return [DishCategorySchema.from_orm(c) for c in categories]


@router.get("/dishes")
async def get_all_dishes(session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(Dish))
    dishes = result.scalars().all()

    if not dishes:
        raise HTTPException(status_code=404, detail="No dishes found")

    return [DishSchema.from_orm(d) for d in dishes]


@router.get("/dishes/category/{category_name}")
async def get_dishes_by_category(category_name: str, session: AsyncSession = Depends(get_async_session)):
    result_category = await session.execute(select(DishCategory).where(DishCategory.name == category_name))
    category = result_category.scalars().first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    result_dishes = await session.execute(
        select(Dish).where(Dish.category_id == category.id).options(joinedload(Dish.category))
    )
    dishes = result_dishes.scalars().all()

    if not dishes:
        raise HTTPException(status_code=404, detail="No dishes found in this category")

    return [DishSchema.from_orm(d) for d in dishes]


@router.get("/dishes/{dish_id}", response_model=DishSchema)
async def get_dish_by_id(dish_id: int, session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(Dish).where(Dish.id == dish_id))
    dish = result.scalars().first()

    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")

    return DishSchema.from_orm(dish)


@router.get("/cart", response_model=CartSchema)
async def get_cart(
        current_user: User = Depends(get_current_user),
        session: AsyncSession = Depends(get_async_session)
):
    cart_query = await session.execute(
        select(Cart)
        .where(Cart.customer_id == current_user.id)
        .options(joinedload(Cart.dishes).joinedload(CartDishAssociation.dish))
    )
    cart = cart_query.scalars().first()

    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    return CartSchema.from_orm(cart)


@router.post("/cart/add-dish", response_model=CartSchema)
async def add_dish_to_cart(
        request: CartDishAddRequest,
        session: AsyncSession = Depends(get_async_session),
        current_user: User = Depends(get_current_user)
):
    # Kiểm tra người dùng và xác thực dữ liệu
    validate_current_user(current_user)
    validate_request_data(request)

    # Kiểm tra món ăn đã tồn tại chưa
    dish = await get_dish_by_id(request.dish_id, session)

    cart = await get_or_create_cart(current_user.id, session)

    # cập nhật món ăn trong giỏ hàng
    await add_or_update_cart_dish(cart.id, request.dish_id, request.quantity, session)

    # Trả lại giỏ hàng đã được cập nhật
    await session.commit()
    await session.refresh(cart, ["dishes"])

    return CartSchema.from_orm(cart)


@router.post("/cart/create-order", response_model=OrderSchema)
async def create_order_from_cart(
        current_user: User = Depends(get_current_user),
        session: AsyncSession = Depends(get_async_session)
):
    cart = await get_cart_with_dishes(current_user, session)

    total_price, total_weight = calculate_order_details(cart)

    customer = await get_customer_with_balance_check(current_user, total_price, session)
    await update_customer_balance(customer, total_price, session)

    new_order = await create_new_order(customer, cart, total_price, total_weight, session)

    for cart_dish in cart.dishes:
        await session.delete(cart_dish)

    await session.commit()
    await session.refresh(new_order)

    return OrderSchema.from_orm(new_order)


@router.post("/customer/update_location", summary="Cập nhật vị trí người dùng")
async def update_customer_location(
        address: str,  # Chuỗi địa chỉ người dùng cung cấp
        current_user: User = Depends(get_current_user),
        session: AsyncSession = Depends(get_async_session)
):
    """
    Cập nhật vị trí người dùng bằng chuỗi địa chỉ thay vì tọa độ.
    """
    # Gọi hàm dịch vụ cập nhật vị trí trong cơ sở dữ liệu
    updated_location = await update_customer_location_service(
        current_user=current_user,
        location=address,  # Sử dụng chuỗi địa chỉ trực tiếp
        session=session
    )

    return {"customer_id": current_user.id, "location": updated_location}


class UpdateCartQuantityRequest(BaseModel):
    dish_id: int
    quantity: int

@router.patch("/cart/update-quantity")
async def update_cart_quantity(
    request: UpdateCartQuantityRequest,
    session: AsyncSession = Depends(get_async_session),
    current_user=Depends(get_current_user)
):
    # Lấy giỏ hàng của user hiện tại
    cart_query = await session.execute(
        select(Cart).where(Cart.customer_id == current_user.id)
    )
    cart = cart_query.scalars().first()

    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    # Truy vấn trực tiếp món ăn từ `cart_dish_association`
    cart_item_query = await session.execute(
        select(CartDishAssociation)
        .where(CartDishAssociation.cart_id == cart.id, CartDishAssociation.dish_id == request.dish_id)
    )
    cart_item = cart_item_query.scalars().first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Dish not found in cart")

    # Cập nhật hoặc xóa món ăn
    if request.quantity <= 0:
        await session.delete(cart_item)
    else:
        cart_item.quantity = request.quantity
        session.add(cart_item)

    # Ghi thay đổi vào cơ sở dữ liệu
    session.commit()

    return {"message": "Cart updated successfully"}



@router.delete("/cart/remove-dish/{dish_id}")
async def remove_dish_from_cart(
    dish_id: int,
    session: AsyncSession = Depends(get_async_session),
    current_user=Depends(get_current_user)
):
    # Tìm giỏ hàng của người dùng hiện tại
    cart_query = await session.execute(
        select(Cart).where(Cart.customer_id == current_user.id)
    )
    cart = cart_query.scalars().first()

    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    # Tìm món ăn trong giỏ hàng bằng `cart_id` và `dish_id`
    cart_item_query = await session.execute(
        select(CartDishAssociation).where(
            CartDishAssociation.cart_id == cart.id,
            CartDishAssociation.dish_id == dish_id
        )
    )
    cart_item = cart_item_query.scalars().first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Dish not found in cart")

    # Xóa món ăn khỏi giỏ hàng
    await session.delete(cart_item)
    await session.commit()

    return {"message": "Dish removed from cart successfully"}




