from datetime import datetime
from typing import Optional, List, Union

from fastapi_users import schemas
from pydantic import BaseModel


class UserRead(schemas.BaseUser[int]):
    # username: str
    email: str
    role_id: int

    class Config:
        # orm_mode = True
        from_attributes = True


class UserCreate(schemas.BaseUserCreate):
    email: str
    username: str
    role_id: int

    class Config:
        # orm_mode = True
        from_attributes = True


class UserUpdate(schemas.BaseUserUpdate):
    email: Optional[str] = None
    password: Optional[str] = None

    class Config:
        # orm_mode = True
        from_attributes = True


class CourierSchema(BaseModel):
    id: int
    rating: Optional[float] = None
    number_of_marks: int
    rate: float
    location: str
    orders: Optional[List['OrderSchema']] = None

    class Config:
        # orm_mode = True
        from_attributes = True


class CustomerSchema(BaseModel):
    id: int
    balance: float
    orders: Optional[List['OrderSchema']] = None
    location: Optional[str] = None

    class Config:
        # orm_mode = True
        from_attributes = True


class RoleSchema(BaseModel):
    id: int
    name: str
    permissions: Optional[dict] = None

    class Config:
        # orm_mode = True
        from_attributes = True


class BaseUser(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        # orm_mode = True
        from_attributes = True


class FullUserSchema(BaseUser):
    role: RoleSchema

    class Config:
        # orm_mode = True
        from_attributes = True


class AdminSchema(BaseModel):
    id: Union[int, UserCreate]
    role_id: Union[int, RoleSchema]

    class Config:
        # orm_mode = True
        from_attributes = True


class CustomerUpdate(BaseModel):
    balance: Optional[float]
    location: Optional[str]

    class Config:
        # orm_mode = True
        from_attributes = True


class CourierUpdate(BaseModel):
    rating: Optional[float]
    rate: Optional[float]
    location: Optional[str]
    number_of_marks: Optional[int]  

    class Config:
        # orm_mode = True
        from_attributes = True