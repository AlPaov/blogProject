from database.models.models import Subscription
from database.connection import session_scope
import asyncio
class subscription_crud:
    def __init__(self):
        self.loop = asyncio.get_event_loop()
            
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
