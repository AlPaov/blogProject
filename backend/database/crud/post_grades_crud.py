from database.models.models import Post_grades
from database.connection import session_scope
import asyncio


class post_grades_crud:
    def __init__(self):
        self.loop = asyncio.get_event_loop()
            
    async def add_post_grade(self, grade: Post_grades):
        async with session_scope() as session:
            session.add(grade)
            return grade.id
    
    async def get_posts_grades_by_type(self, type, post_id):
        async with session_scope() as session:
            grades = [x.id for x in session.query(Post_grades)
                                           .filter(Post_grades.type == type)
                                           .filter(Post_grades.post_id == post_id)
                                           .all()]
            if grades:
                return grades
            return []
    
    async def check_if_user_graded(self, user_id, post_id):
        async with session_scope() as session:
            subs = [
                    x.type for x in session
                    .query(Post_grades)
                    .filter(Post_grades.user_id == user_id,
                            Post_grades.post_id == post_id)
                    ]
            if subs:
                return subs[0]
            return None
        
    async def get_post_gradeid_by_user_post(self, user_id, post_id):
        async with session_scope() as session:
            subs = [
                x.id for x in session
                .query(Post_grades)
                .filter(Post_grades.user_id == user_id,
                        Post_grades.post_id == post_id)
                    ]
            if subs:
                return subs[0]
            return None
    
    async def get_users_posts_karma(self, posts):
        async with session_scope() as session:
            grades = []
            if posts:
                for post in posts:
                    grades += [
                            x.type for x in session
                            .query(Post_grades)
                            .filter(Post_grades.post_id == post)
                        ]
                result = grades.count('like') - grades.count('dislike')
            else:
                return 0
        return result
        
    async def delete_post_grade_by_id(self, id: int):
        async with session_scope() as session:
            grade = session.query(Post_grades).get(id)
            if grade:
                session.delete(grade) 
                return True
            return False            
