from datetime import datetime

from pydantic import BaseModel
from typing import List, Optional

from schemas.delivery import DishSchema


class OrderCreate(BaseModel):
    user_id: int
    restaurant_id: int
    dish_ids: List[int]
    total_price: float

    class Config:
        # orm_mode = True
        from_attributes = True


class OrderUpdate(BaseModel):
    status: Optional[str] = None
    total_price: Optional[float] = None

    class Config:
        # orm_mode = True
        from_attributes = True


class OrderRead(OrderCreate):
    id: int
    status: str
    created_at: str
    updated_at: str

    class Config:
        # orm_mode = True
        from_attributes = True


class DetailedOrderSchema(BaseModel):
    id: int
    price: float
    weight: float
    location: str
    dishes: List[DishSchema]

    class Config:
        # orm_mode = True
        from_attributes = True


class OrderDishSchema(BaseModel):
    dish: DishSchema
    quantity: int

    class Config:
        # orm_mode = True
        from_attributes = True


class OrderSchema(BaseModel):
    id: int
    price: float
    time_of_creation: datetime
    dishes: List[OrderDishSchema]

    class Config:
        # orm_mode = True
        from_attributes = True


class OrderInfoSchema(BaseModel):
    cost: float
    creation_date: datetime
    weight: float
    location: str

    class Config:
        # orm_mode = True
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    is_prepared: bool = None
    is_delivered: bool = None
