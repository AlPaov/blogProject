import asyncio
from database.crud.post_crud import post_crud, Post
from database.crud.post_grades_crud import post_grades_crud
from database.crud.comment_crud import comment_crud
from database.crud.comment_grades_crud import comment_grades_crud
from database.crud.subscriber_crud import subscription_crud
from database.crud.user_crud import user_crud
from logic.services.utils import util
from logic.dtos.responses.user_responses import UserInfoResponse
from logic.dtos.responses.post_responses import PostsResponse
from logic.dtos.responses.comment_responses import CommentResponse

user_rep = user_crud()
posts_crud = post_crud()
grades_crud = post_grades_crud()
comments_crud = comment_crud()
comment_grade_crud = comment_grades_crud()
sub_crud = subscription_crud()
utils = util()

class user_service():

    def __init__(self):
        self.loop = asyncio.get_event_loop()
    
    async def get_user_info(self, user_id):
        user = await user_rep.get_user_info_by_id(user_id)
        
        user_posts_id = await posts_crud.get_posts_id_by_creator_id(user_id)
        user_comments = await comments_crud.get_comments_id_by_creator_id(user_id)
        
        user_posts_overall_grade = await grades_crud.get_users_posts_karma(user_posts_id)
        user_comments_overall_grade = await comment_grade_crud.get_users_comments_karma(user_comments)
        
        followers =  len(await sub_crud.get_user_subscriptions(user_id))
        following =  len(await sub_crud.get_subs_by_user_id(user_id))
        
        karma = user_posts_overall_grade + user_comments_overall_grade
    
                
        user['followers'] = followers
        user['following'] = following
        user['karma'] = karma
        
        return UserInfoResponse(**user)

    async def add_user_post(self, data):
        return await posts_crud.add_post(Post(**data.__dict__))
    
    async def get_user_posts(self, user_id, current_user_id):
        user_posts = await posts_crud.get_posts_by_creator_id(user_id)
        result = await utils.get_posts_with_new_data(current_user_id, user_posts)
        return PostsResponse(posts = result)
   
    async def get_if_user_subscribed(self, user_id, subscribtion_id):
        result = await sub_crud.get_if_user_subscribed(user_id, subscribtion_id)
        return result
    
    async def get_user_followers(self, user_id):
        followers = await sub_crud.get_user_subscriptions(user_id)
        return followers
    
    async def get_user_follows(self, user_id):
        follows = await sub_crud.get_subs_by_user_id(user_id)
        return follows
         
    async def get_user_comments(self, user_id, current_user_id):
        user_comments = await comments_crud.get_comments_by_creator_id(user_id)
        user_comments = await utils.get_comments_with_new_data(current_user_id, user_id, user_comments)
        return CommentResponse(comments = user_comments)
    
    async def delete_user_post(self, post_id):
        return await posts_crud.delete_post_by_id(post_id)
        
    async def update_user_post(self, data):
        return await posts_crud.update_post_by_id(data.id, data.title, data.description)
        
    async def delete_user_follow(self, user_id, follow_id):
        return await sub_crud.delete_sub(user_id, follow_id)
        
    async def delete_user_follower(self, user_id, follower_id):
        return await sub_crud.delete_sub(follower_id, user_id)
        
    async def delete_user_comment(self, comment_id):
        return await comments_crud.delete_comment_by_id(comment_id)
        
    async def update_user_comment(self, data):
        return await comments_crud.update_comment_by_id(data.comment_id, data.text)


