import sys
sys.path.append('C:/Users/horrr/OneDrive/Рабочий стол/blog/backend')


from fastapi import APIRouter
from fastapi.responses import JSONResponse
from logic.services.login_service import login_service
from logic.dtos.requests.user_requests import UserLoginRequest

router = APIRouter(
    prefix="/login",
    tags=['login'],
)
login_page = login_service()

@router.post('/')
async def login_user_jwt(data: UserLoginRequest):
    
    access_token = await login_page.user_login(data)
    user_id = await login_page.get_user_info(data)
    response = JSONResponse(content={
        'user_id': user_id,
        "access_token": access_token['access_token']
    })
    
    return response 

