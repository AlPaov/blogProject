import sys
sys.path.append('C:/Users/horrr/OneDrive/Рабочий стол/blog/backend')

from sqlalchemy import or_
from database.models.models import User
from database.connection import session_scope
from logic.dtos.requests.user_requests import UpdateEmailRequest, UpdatePasswordRequest, UpdateUsernameRequest
import asyncio

class user_crud:
    def __init__(self):
        self.loop = asyncio.get_event_loop()

    
    async def get_users(self):
        async with session_scope() as session:
            return session.query(User).all()

    async def get_username_by_id(self, id: int):
        async with session_scope() as session:
            user = session.query(User).get(id)
            if user:
                user_out = user.username
                return user_out
            return None
    
    async def get_user_info_by_id(self, id: int):
        async with session_scope() as session:
            user = session.query(User).get(id)
            user_out = {
                'username': user.username,
                'register_date': user.register_date
            }
            return user_out
    
    async def get_user_by_mail(self, mail: str):
        async with session_scope() as session:
            user = session.query(User).filter(User.mail == mail).first()
            if user:
                return user.id
            return False
    
    async def get_hashed_password_by_id(self, id: int):
        async with session_scope() as session:
            user = session.query(User).filter(User.id == id).first()
            if user:
                return user.password
            return False
    
    async def get_user_login_check(self, data):
        user = User()
        async with session_scope() as session:
            login_or_email = data.login_or_email
            db_user = session.query(User)\
                          .filter(or_(User.login == login_or_email, 
                                      User.mail == login_or_email)).first()
            if db_user:
                user.id = db_user.id
                user.login = db_user.login
                user.mail = db_user.mail
                user.username = db_user.username
                user.register_date = db_user.register_date
                user.password = db_user.password
                return user
            return False
    
    async def get_user_info_check(self, id, password):
        async with session_scope() as session:
            user = session.query(User)\
                          .filter(User.id == id, User.password == password)\
                          .first()
            if user:
                return True
            return False
    
    async def add_user(self, user: User):
        async with session_scope() as session:
            session.add(user)
            session.flush()
            return user.id
            
    async def get_user_by_login(self, login):
        async with session_scope() as session:
            user = session.query(User).filter(User.login == login).first() 
            if user:
                return user
            return False
            
    async def delete_user_by_id(self, id: int):
        async with session_scope() as session:
            user = session.query(User).get(id)
            if user:
                session.delete(user) 
                return True
            return False

    async def update_user(self, updated_user: User):
        async with session_scope() as session:
            if session.query(User).filter(User.id == updated_user.id).first():
                session.merge(updated_user)
                return True
            return False    
    
    async def update_user_password(self, updated_data: UpdatePasswordRequest):
        async with session_scope() as session:
            session.query(User)\
                    .filter(User.id == updated_data.id)\
                    .update({User.password: updated_data.new_password})
  

    async def update_user_email(self, updated_data: UpdateEmailRequest):
        async with session_scope() as session:
            session.query(User)\
                    .filter(User.id == updated_data.id)\
                    .update({User.mail: updated_data.mail})


    async def update_user_username(self, updated_data: UpdateUsernameRequest):
        async with session_scope() as session:
            session.query(User)\
                    .filter(User.id == updated_data.id)\
                    .update({User.username: updated_data.username})
  
           
