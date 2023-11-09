import asyncio
from database.crud.post_crud import post_crud
from database.crud.post_grades_crud import post_grades_crud, Post_grades
from database.crud.comment_crud import comment_crud
from database.crud.subscriber_crud import subscription_crud
from logic.dtos.responses.post_responses import PostsResponse
from database.crud.joins_crud import joins_crud
from logic.services.utils import util

posts_crud = post_crud()
grades_crud = post_grades_crud()
comments_crud = comment_crud()
sub_crud = subscription_crud()
join_crud = joins_crud()
utils = util()
 
class Homepage_service():
    
    def __init__(self):
        self.loop = asyncio.get_event_loop()
    
    async def get_posts(self, current_user_id, subs: int = 0) -> PostsResponse:
        if subs == 1:
            posts = await join_crud.get_users_subscribed_posts(current_user_id)
        else:
            posts = await posts_crud.get_posts()
            
        result = await utils.get_posts_with_new_data(current_user_id, posts)
            
        return PostsResponse(posts=result)    
         
    async def like_post(self, data) -> bool:
        
        grade_id = await grades_crud.get_post_gradeid_by_user_post(data.user_id, data.post_id)
        user_grade = await grades_crud.check_if_user_graded(data.user_id, data.post_id)
        
        if user_grade == data.type:
            await grades_crud.delete_post_grade_by_id(grade_id)
        else:
            await grades_crud.delete_post_grade_by_id(grade_id)
            await grades_crud.add_post_grade(Post_grades(**data.__dict__))
        return True
    
    async def subscribe(self, data):
        user_id = data.user_id
        following_id = data.follow_id
        subscription_id = await sub_crud.get_if_user_subscribed(user_id, following_id)
        print(subscription_id)
        if subscription_id:
            await sub_crud.delete_sub(user_id, following_id)
            return True
        else:
            if await sub_crud.add_subscription(user_id, following_id) :
                return True
        return False

    
    
