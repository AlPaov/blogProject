import sys
sys.path.append('C:/Users/horrr/OneDrive/Рабочий стол/blog/backend')

from database.models.models import Subscription
from database.connection import session_scope
import asyncio
class subscription_crud:
    def __init__(self):
        self.loop = asyncio.get_event_loop()

    async def get_all_subs(self):
        async with session_scope() as session:
            return session.query(Subscription).all()

    async def get_sub_by_id(self, id: int):
        async with session_scope() as session:
            return session.query(Subscription).get(id)
            
    async def get_subs_by_user_id(self, id):
        async with session_scope() as session:
            subs = [
                sub.follow_id for sub in session
                .query(Subscription)
                .filter(Subscription.user_id == id)
                ]
            if subs:
                return subs
            return []
    
    async def get_if_user_subscribed(self, id, follows_id):
        async with session_scope() as session:
            sub = session\
                  .query(Subscription)\
                  .filter(Subscription.user_id == id,
                          Subscription.follow_id == follows_id).first()
  
            if sub:
                return True
            return False
    
      
    async def get_user_subscriptions(self, id):
        async with session_scope() as session:
            subs = [
                    sub.user_id for sub in session.query(Subscription)\
                    .filter(Subscription.follow_id == id)
                   ]
            if subs:
                return subs
            return []
         
    async def add_subscription(self, user_id, user_follow):
        async with session_scope() as session:
            subscription = Subscription(
                            user_id=user_id,
                            follow_id=user_follow
                        )
            session.add(subscription)
            session.flush()
            return subscription.id
            
    
    async def delete_sub_by_id(self, id: int):
        async with session_scope() as session:
            sub = session.query(Subscription).get(id)
            if sub:
                session.delete(sub) 
                return True
            return False

    async def delete_sub(self, user_id, follows_id):
        async with session_scope() as session:
            sub = session\
                   .query(Subscription)\
                   .filter(Subscription.user_id == user_id,
                          Subscription.follow_id == follows_id)\
                   .first()
            if sub:
                session.delete(sub)
                return True
            return False  
    # def get_all_subs(self):
    #     with session_scope() as session:
    #         return session.query(Subscription).all()

    # def get_sub_by_id(self, id: int):
    #     with session_scope() as session:
    #         return session.query(Subscription).get(id)
            
    # def get_subs_by_user_id(self, id):
    #     with session_scope() as session:
    #         subs = [
    #             sub.follow_id for sub in session
    #             .query(Subscription)
    #             .filter(Subscription.user_id == id)
    #             ]
    #         if subs:
    #             return subs
    #         return []
    
    # def get_if_user_subscribed(self, id, follows_id):
    #     with session_scope() as session:
    #         sub = session\
    #               .query(Subscription)\
    #               .filter(Subscription.user_id == id,
    #                       Subscription.follow_id == follows_id).first()
  
    #         if sub:
    #             return sub
    #         return False
    
      
    # def get_user_subscriptions(self, id):
    #     with session_scope() as session:
    #         subs = [
    #                 sub.user_id for sub in session.query(Subscription)\
    #                 .filter(Subscription.follow_id == id)
    #                ]
    #         if subs:
    #             return subs
    #         return []
         
    # def add_subscription(self, user_id, user_follow):
    #     with session_scope() as session:
    #         subscription = Subscription(
    #                         user_id=user_id,
    #                         follow_id=user_follow
    #                     )
    #         session.add(subscription)
    #         session.flush()
    #         return subscription.id
            
    
    # def delete_sub_by_id(self, id: int):
    #     with session_scope() as session:
    #         sub = session.query(Subscription).get(id)
    #         if sub:
    #             session.delete(sub) 
    #             return True
    #         return False

    # def delete_sub(self, user_id, follows_id):
    #     with session_scope() as session:
    #         sub = session\
    #                .query(Subscription)\
    #                .filter(Subscription.user_id == user_id,
    #                       Subscription.follow_id == follows_id)\
    #                .first()
    #         if sub:
    #             session.delete(sub)
    #             return True
    #         return False
# test = subscription_crud()
# subscription = Subscription(
#     user_id=1,
#     follow_id=2
# )
# print(test.add_subscription(subscription))