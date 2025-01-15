import pytest
from fastapi import HTTPException

from models.delivery import Dish, CartDishAssociation, Cart
from services.customer_service import calculate_order_details


@pytest.mark.asyncio
async def test_calculate_order_details_valid_cart():
    dish1 = Dish(id=1, price=100, weight=200)
    dish2 = Dish(id=2, price=50, weight=100)

    cart_dish1 = CartDishAssociation(dish=dish1, quantity=2)
    cart_dish2 = CartDishAssociation(dish=dish2, quantity=1)

    cart = Cart(dishes=[cart_dish1, cart_dish2])
    
    total_price, total_weight = calculate_order_details(cart)

    assert total_price == 250  
    assert total_weight == 500  


@pytest.mark.asyncio
async def test_calculate_order_details_empty_cart():
    cart = Cart(dishes=[])

    with pytest.raises(HTTPException) as exc_info:
        calculate_order_details(cart)

    assert exc_info.value.status_code == 400
    assert "Cart is empty" in str(exc_info.value.detail)


@pytest.mark.asyncio
async def test_calculate_order_details_invalid_quantity():
    dish = Dish(id=1, price=100, weight=200)
    cart_dish = CartDishAssociation(dish=dish, quantity=0) 

    cart = Cart(dishes=[cart_dish])

    with pytest.raises(HTTPException) as exc_info:
        calculate_order_details(cart)

    assert exc_info.value.status_code == 400
    assert f"Invalid quantity for dish {cart_dish.dish_id}" in str(exc_info.value.detail)
