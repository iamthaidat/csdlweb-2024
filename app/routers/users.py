from fastapi import APIRouter, Depends, HTTPException
from fastapi_users import FastAPIUsers
from fastapi_users.schemas import BaseUser
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status
from starlette.responses import JSONResponse

from auth.auth import auth_backend
from auth.database import get_async_session
from auth.manager import get_user_manager
from dependencies import get_current_user, get_current_superuser
from models.delivery import User, Customer
from schemas.user import UserRead, UserCreate, UserUpdate


router = APIRouter(prefix="/auth")

fastapi_users = FastAPIUsers[BaseUser, int](
    get_user_manager,
    [auth_backend],

)

router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/jwt",
    tags=["auth"],
)

router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    tags=["auth"],
)




@router.get('/my_role', tags=['auth'])
async def my_role(user: BaseUser = Depends(get_current_user)):
    return JSONResponse(status_code=status.HTTP_200_OK, content={"role": user.role_id})


@router.get('/verify_token', tags=['auth'])
async def verify_token(user: BaseUser = Depends(get_current_user)):
    return JSONResponse(status_code=status.HTTP_200_OK, content="Token is valid")


@router.get('/me', response_model=BaseUser, tags=['auth'])
async def get_me(user: BaseUser = Depends(get_current_user)):
    return user


@router.put('/me', response_model=UserUpdate, tags=['auth'])
async def update_me(user_update: UserUpdate, user: BaseUser = Depends(get_current_user),
                    user_manager=Depends(get_user_manager)):
    await user_manager.update(user_update, user)
    return user_update


@router.delete('/me', tags=['auth'])
async def delete_me(user: BaseUser = Depends(get_current_user), user_manager=Depends(get_user_manager)):
    await user_manager.delete(user)
    return JSONResponse(status_code=status.HTTP_200_OK, content="Account succesfully deleted")


@router.get('/users', tags=['auth'])
async def get_users(user: BaseUser = Depends(get_current_superuser),
                    session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(User))
    users = result.scalars().all()
    return users


class BalanceUpdateRequest(BaseModel):
    amount: float

    class Config:
        # orm_mode = True
        from_attributes = True


@router.post('/user/balance')
async def add_balance(
        balance: BalanceUpdateRequest,
        current_user: User = Depends(get_current_user),
        session: AsyncSession = Depends(get_async_session)
):
    amount = balance.amount
    user_id = current_user.id

    query = select(Customer).where(Customer.id == user_id)
    result = await session.execute(query)
    customer = result.scalar_one_or_none()

    if customer is None:
        raise HTTPException(status_code=404, detail="User not found")

    customer.balance += amount
    session.add(customer)

    await session.commit()

    return {"message": "Balance updated successfully", "new_balance": customer.balance}


@router.get('/user/balance')
async def get_balance(
        current_user: BaseUser = Depends(get_current_user),
        session: AsyncSession = Depends(get_async_session)
):
    user_id = current_user.id

    query = select(Customer).where(Customer.id == user_id)
    result = await session.execute(query)
    customer = result.scalar_one_or_none()

    if customer is None:
        raise HTTPException(status_code=404, detail="User not found")

    return {"balance": customer.balance}
