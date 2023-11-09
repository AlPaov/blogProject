from fastapi import APIRouter, Depends
from logic.services.settings_service import settings_service
from logic.schemas.user_schema import UserBase
from logic.dtos.requests.user_requests import UpdateEmailRequest, UpdatePasswordRequest, UpdateUsernameRequest
from auth.jwt_bearer import jwtBearer


router = APIRouter(
    prefix="/user/{user_id}/settings",
    tags=['settings'],
    dependencies=[Depends(jwtBearer())]
)
settings = settings_service()

@router.post('/')
async def update_user_data(new_data: UserBase):
    return await settings.update_user_data(new_data)

@router.post('/update_email')
async def update_user_email(new_data: UpdateEmailRequest):
    return await settings.update_user_mail(new_data)

@router.post('/update_password')
async def update_user_password(new_data: UpdatePasswordRequest):
    return await settings.update_user_password(new_data)

@router.post('/update_username')
async def update_user_username(new_data: UpdateUsernameRequest):
    return await settings.update_user_username(new_data)