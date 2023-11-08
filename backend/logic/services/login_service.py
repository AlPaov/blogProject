import sys
sys.path.append('C:/Users/horrr/OneDrive/Рабочий стол/blog/backend')
import asyncio
from fastapi import HTTPException, status
from database.crud.user_crud import user_crud
from logic.dtos.requests.user_requests import UserLoginRequest
from logic.services.hashing import Hasher
from auth.jwt_handler import signJWT, decodeJWT
user_rep = user_crud()
hash= Hasher()

class login_service():
    def __init__(self):
        self.loop = asyncio.get_event_loop()
    
    async def user_login(self, data: UserLoginRequest):
        user = await user_rep.get_user_login_check(data)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                                detail='The user not found.')
        
        if not hash.verify_password(data.password, user.password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                                detail='The password doesnt match.')

        return signJWT(user.id)
    
    async def get_user_info(self, data):
        user = await user_rep.get_user_login_check(data)
        return user.id
    