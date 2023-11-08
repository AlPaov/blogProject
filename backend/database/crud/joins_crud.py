import sys
sys.path.append('C:/Users/horrr/OneDrive/Рабочий стол/blog/backend')

from database.models.models import Subscription, Post
from database.connection import session_scope
import asyncio

class joins_crud:
    def __init__(self):
        self.loop = asyncio.get_event_loop() 
    
    async def get_users_subscribed_posts(self, user_id):
        async with session_scope() as session:
            posts = session.query(Post)\
                    .filter(Post.creator_id.in_(
                    session.query(Subscription.follow_id)
                    .filter(Subscription.user_id == user_id)
                    )).all()
            result = [{**post.__dict__} for post in posts]
            if result:
                return result
            return None
        
    # def get_users_subscribed_posts(self, user_id):
    #     with session_scope() as session:
    #         posts = session.query(Post)\
    #                 .filter(Post.creator_id.in_(
    #                 session.query(Subscription.follow_id)
    #                 .filter(Subscription.user_id == user_id)
    #                 )).all()
    #         result = [{**post.__dict__} for post in posts]
    #         if result:
    #             return result
    #         return None            
            
# test = joins_crud()    
# print(test.get_users_subscribed_posts(6))