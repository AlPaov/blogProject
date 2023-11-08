import sys
sys.path.append('C:/Users/horrr/OneDrive/Рабочий стол/blog/backend')
from database.models.models import Comment
from database.connection import session_scope, Session
from sqlalchemy import asc
import asyncio

session = Session()


class comment_crud:
    def __init__(self):
        self.loop = asyncio.get_event_loop()

    async def get_comments(self):
        async with session_scope() as session:
            return session.query(Comment).all()

    async def get_comment_by_id(self, id: int):
        async with session_scope() as session:
            comment = session.query(Comment).get(id)
            if comment:
                new_comment = {
                            'id': comment.id, 
                            'creator_id': comment.creator_id, 
                            'post_id': comment.post_id, 
                            'text': comment.text, 
                            'create_date': comment.create_date 
                } 
                return new_comment
            return False
        
    async def add_comment(self, comment: Comment):
        async with session_scope() as session:
            session.add(comment)
            session.flush()
            new_comment = {
                         'id': comment.id, 
                         'creator_id': comment.creator_id, 
                         'post_id': comment.post_id, 
                         'text': comment.text, 
                         'create_date': comment.create_date 
            }   
            return new_comment
            
    async def get_comments_id_by_creator_id(self, id):
        async with session_scope() as session:
            comments = [x.id for x in session.query(Comment).filter(Comment.creator_id == id).all()]
            if comments:
                return comments
            return None
        
    async def get_comments_by_creator_id(self, id):
        async with session_scope() as session:
            db_comments = session.query(Comment).filter(Comment.creator_id == id).all()
            
            comments = [{
                         'id': com.id, 
                         'creator_id': com.creator_id, 
                         'post_id': com.post_id, 
                         'text': com.text, 
                         'create_date': com.create_date   
                         }       
                         for com in db_comments]
            
            if comments:
                return comments
            return []
            
    async def get_comments_by_post_id(self, id):
        async with session_scope() as session:
            db_comments = session.query(Comment)\
                                 .filter(Comment.post_id == id)\
                                 .order_by(asc(Comment.create_date))\
                                 .all()
            comments = [{
                         'id': comment.id, 
                         'creator_id': comment.creator_id, 
                         'post_id': comment.post_id, 
                         'text': comment.text, 
                         'create_date': comment.create_date
                        }
                        for comment in db_comments]
            if comments:
                return comments
            return []
    
    async def delete_comment_by_id(self, id: int):
        async with session_scope() as session:
            comment = session.query(Comment).get(id)
            if comment:
                session.delete(comment) 
                return True
            return False

    async def update_comment_by_id(self, id: int, text):
        async with session_scope() as session:
            comment = session.query(Comment).get(id)
            if comment:
                if text:
                    comment.text = text
                return True
            return False            
    # def get_comments(self):
    #     with session_scope() as session:
    #         return session.query(Comment).all()

    # def get_comment_by_id(self, id: int):
    #     with session_scope() as session:
    #         return session.query(Comment).get(id)
            
    # def add_comment(self, comment: Comment):
    #     with session_scope() as session:
    #         session.add(comment)
    #         session.flush()
    #         return comment.id
            
    # def get_comments_id_by_creator_id(self, id):
    #     with session_scope() as session:
    #         comments = [x.id for x in session.query(Comment).filter(Comment.creator_id == id).all()]
    #         if comments:
    #             return comments
    #         return None
        
    # def get_comments_by_creator_id(self, id):
    #     with session_scope() as session:
    #         db_comments = session.query(Comment).filter(Comment.creator_id == id).all()
            
    #         comments = [{
    #                      'id': com.id, 
    #                      'creator_id': com.creator_id, 
    #                      'post_id': com.post_id, 
    #                      'text': com.text, 
    #                      'create_date': com.create_date   
    #                      }       
    #                      for com in db_comments]
            
    #         if comments:
    #             return comments
    #         return []
            
    # def get_comments_by_post_id(self, id):
    #     with session_scope() as session:
    #         db_comments = session.query(Comment)\
    #                              .filter(Comment.post_id == id)\
    #                              .order_by(desc(Comment.create_date))\
    #                              .all()
    #         comments = [{
    #                      'id': comment.id, 
    #                      'creator_id': comment.creator_id, 
    #                      'post_id': comment.post_id, 
    #                      'text': comment.text, 
    #                      'create_date': comment.create_date
    #                     }
    #                     for comment in db_comments]
    #         if comments:
    #             return comments
    #         return []
    
    # def delete_comment_by_id(self, id: int):
    #     with session_scope() as session:
    #         comment = session.query(Comment).get(id)
    #         if comment:
    #             session.delete(comment) 
    #             return True
    #         return False

    # def update_comment_by_id(self, id: int, text):
    #     with session_scope() as session:
    #         comment = session.query(Comment).get(id)
    #         if comment:
    #             if text:
    #                 comment.text = text
    #             return True
    #         return False





