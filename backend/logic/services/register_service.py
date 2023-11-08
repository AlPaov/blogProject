import sys
sys.path.append('C:/Users/horrr/OneDrive/Рабочий стол/blog/backend')
import asyncio
from database.crud.user_crud import user_crud, User
from logic.dtos.requests.user_requests import UserRegisterRequest
from logic.services.hashing import Hasher
from auth.jwt_handler import signJWT

hash = Hasher()
user_rep = user_crud()


class register_service():
    def __init__(self):
        self.loop = asyncio.get_event_loop()
    


    async def add_user(self, data: UserRegisterRequest):
        user =  await user_rep.add_user(User(
                login=data.login,
                password=hash.get_password_hash(data.password),
                mail= data.mail,
                username=data.username,
                register_date= data.register_date
                                            ))
        return signJWT(user)
    
    async def get_user_info(self, data):
        user_id = await user_rep.get_user_by_mail(data.mail)
        return user_id


