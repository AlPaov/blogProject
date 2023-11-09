import sys
sys.path.append('C:/Users/horrr/OneDrive/Рабочий стол/blog/backend')


from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from logic.services.register_service import register_service
from logic.dtos.requests.user_requests import UserRegisterRequest
from database.crud.user_crud import user_crud



router = APIRouter(
    prefix="/register",
    tags=['register'],
)
register_page = register_service()
user_rep = user_crud()

@router.post('/')
async def add_user(data: UserRegisterRequest):
    
    db_user_mail = await user_rep.get_user_by_mail(data.mail)
    db_user_login = await user_rep.get_user_by_login(data.login)
        
    
    if db_user_login:
        raise HTTPException(status_code=400, detail='Login already used')
    elif db_user_mail:
        raise HTTPException(status_code=400, detail='Email already used')
    
    access_token = await register_page.add_user(data)
    user_id = await register_page.get_user_info(data)
    response = JSONResponse(content={
        'user_id': user_id,
        "access_token": access_token['access_token']
    })
    
    return response 
