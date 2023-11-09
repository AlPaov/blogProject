import asyncio
from database.crud.user_crud import user_crud
from logic.services.hashing import Hasher
hasher = Hasher();
user_rep = user_crud()


class settings_service():
    
    def __init__(self):
        self.loop = asyncio.get_event_loop()
        
    async def update_user_mail(self, new_user_data):
        current_hashed_password = await user_rep.get_hashed_password_by_id(new_user_data.id)
        if hasher.verify_password(new_user_data.password, current_hashed_password):
            return await user_rep.update_user_email(new_user_data)
        else:
            return False
            
    async def update_user_password(self, new_user_data):
        new_hashed_password = hasher.get_password_hash(new_user_data.new_password)
        current_hashed_password = await user_rep.get_hashed_password_by_id(new_user_data.id)
        if hasher.verify_password(new_user_data.password, current_hashed_password):
            new_user_data.set_password(new_hashed_password)
            return await user_rep.update_user_password(new_user_data)
        else:
            return False
        
        
    async def update_user_username(self, new_user_data):
        current_hashed_password = await user_rep.get_hashed_password_by_id(new_user_data.id)
        if hasher.verify_password(new_user_data.password, current_hashed_password):
            return await user_rep.update_user_username(new_user_data)
        else:
            return False
        