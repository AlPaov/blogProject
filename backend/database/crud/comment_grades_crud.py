from database.models.models import Comment_grades
from database.connection import session_scope
import asyncio

class comment_grades_crud:
    def __init__(self):
        self.loop = asyncio.get_event_loop()

    async def add_comment_grade(self, grade):
        async with session_scope() as session:
            new_grade = Comment_grades(**grade.dict())
            session.add(new_grade)
            session.flush()
            return new_grade.id
    
    async def get_users_comments_karma(self, comments):
        async with session_scope() as session:
            grades = []
            if comments:
                for comment in comments:
                    grades += [
                        x.type for x in session
                        .query(Comment_grades)
                        .filter(Comment_grades.comment_id == comment)
                        ]
                result = grades.count('like') - grades.count('dislike')
            else:
                return 0
        return result
    
    async def get_comments_grades_by_type(self, type, id):
        async with session_scope() as session:
            grades = [x.id for x in session
                      .query(Comment_grades)
                      .filter(Comment_grades.type == type, 
                              Comment_grades.comment_id == id)
                      .all()]
            if grades:
                return grades
            return []
    
    async def check_if_user_graded(self, user_id, comment_id):
        async with session_scope() as session:
            grade = [x.type for x in session
                      .query(Comment_grades)
                      .filter(Comment_grades.user_id == user_id, 
                              Comment_grades.comment_id == comment_id)
                    ]
            if grade:
                return grade[0]
            return None
        
    async def get_comment_gradeid_by_user(self, user_id, comment_id):
        async with session_scope() as session:
            grade = [x.id for x in session
                      .query(Comment_grades)
                      .filter(Comment_grades.user_id == user_id, 
                              Comment_grades.comment_id == comment_id)
                    ]
            if grade:
                return grade[0]
            return None        
            
    async def delete_comment_grade_by_id(self, id: int):
        async with session_scope() as session:
            grade = session.query(Comment_grades).get(id)
            if grade:
                session.delete(grade) 
                return True
            return False   