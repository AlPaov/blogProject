from database.crud.post_crud import post_crud
import asyncio
from database.crud.post_grades_crud import post_grades_crud
from database.crud.comment_crud import comment_crud
from database.crud.comment_grades_crud import comment_grades_crud
from database.crud.subscriber_crud import subscription_crud
from database.crud.joins_crud import joins_crud
from database.crud.user_crud import user_crud

posts_crud = post_crud()
grades_post_crud = post_grades_crud()
comments_crud = comment_crud()
sub_crud = subscription_crud()
join_crud = joins_crud()
grades_comment_crud = comment_grades_crud()
users_crud = user_crud()


class util():

    def __init__(self):
        self.loop = asyncio.get_event_loop()
        
    async def get_posts_with_new_data(self, current_user_id, posts):
        
        if posts:
            for post in posts:
            
                likes =  len(await grades_post_crud.get_posts_grades_by_type('like', post['id']))
                dislikes =  len(await grades_post_crud.get_posts_grades_by_type('dislike', post['id']))
                comments_count =  len(await comments_crud.get_comments_by_post_id(post['id']))
                following = await sub_crud.get_if_user_subscribed(current_user_id, post['creator_id'])
                liked_or_disliked = await grades_post_crud.check_if_user_graded(current_user_id, post['id'])
                creator_username = await users_crud.get_username_by_id(post['creator_id'])
                
                post['grade'] = likes - dislikes
                post['creator_username'] = creator_username
                post['comments_count'] = comments_count
                post['subscribed'] = bool(following)
                post['like_or_dis'] = liked_or_disliked
            return posts 
        return []
        
    async def get_comments_with_new_data(self, current_user_id, user_id, comments):
        
        comments_list = comments
    
        for comment in comments_list:
            like_list = await grades_comment_crud.get_comments_grades_by_type('like', comment['id'])
            likes = len(like_list)

            dislike_list = await grades_comment_crud.get_comments_grades_by_type('dislike', comment['id'])   
            dislikes = len(dislike_list)
            
            liked_or_disliked = await grades_comment_crud.check_if_user_graded(current_user_id, comment['id'])
            
            creator_username = await users_crud.get_username_by_id(comment['creator_id'])

            comment['creator_username'] = creator_username
            comment['grade'] = likes - dislikes
            comment['like_or_dis'] = liked_or_disliked
            
        return comments_list