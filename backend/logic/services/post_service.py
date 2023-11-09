import asyncio
from database.crud.post_crud import post_crud
from database.crud.comment_crud import comment_crud, Comment
from database.crud.comment_grades_crud import comment_grades_crud
from logic.services.utils import util
from logic.schemas.post_schema import PostAllInfo
from logic.dtos.responses.comment_responses import CommentResponse


posts_crud = post_crud()
comments_crud = comment_crud()
comment_grade_crud = comment_grades_crud()
utils = util()

class post_service():

    def __init__(self):
        self.loop = asyncio.get_event_loop()
        
    async def get_post_info(self, current_user_id, post_id) -> PostAllInfo:
        post = await posts_crud.get_post_by_id(post_id)
        new_post = await utils.get_posts_with_new_data(current_user_id, [post])
        result = new_post[0]
        print(type(result))
        return PostAllInfo(**result)

    async def get_comments(self, current_user_id, user_id, post_id) -> CommentResponse:
        comments = await comments_crud.get_comments_by_post_id(post_id)
        new_comments = await utils.get_comments_with_new_data(current_user_id, user_id, comments)
        return CommentResponse(comments=new_comments)
    
    async def get_comment_by_id(self, comment_id):
        return await comments_crud.get_comment_by_id(comment_id)
        
    async def add_comment(self, data):
        return await comments_crud.add_comment(Comment(**data.__dict__))
    
    async def delete_comment(self, comment_id):
        return await comments_crud.delete_comment_by_id(comment_id)
        
    async def update_comment(self, data):
        return await comments_crud.update_comment_by_id(data.comment_id, data.text)
        
    async def like_comment(self, data) -> bool:
        grade_id = await comment_grade_crud.get_comment_gradeid_by_user(data.user_id, data.comment_id)
        user_grade = await comment_grade_crud.check_if_user_graded(data.user_id, data.comment_id)
        
        if user_grade == data.type:
            await comment_grade_crud.delete_comment_grade_by_id(grade_id)
        else:
            await comment_grade_crud.delete_comment_grade_by_id(grade_id)
            await comment_grade_crud.add_comment_grade(data)
        return True
    
    
    