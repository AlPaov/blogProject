from sqlalchemy import desc
from database.models.models import Post
from database.connection import session_scope
import asyncio

class post_crud:
    def __init__(self):
        self.loop = asyncio.get_event_loop()

    async def get_posts(self):
        async with session_scope() as session:
            db_posts = session.query(Post).order_by(desc(Post.create_date)).all()
            posts = [{'id': post.id, 
                      'title': post.title, 
                      'description': post.description, 
                      'create_date': post.create_date, 
                      'creator_id': post.creator_id
                     }
                    for post in db_posts]
            return posts
    
    async def add_post(self, post: Post):
        async with session_scope() as session:
            session.add(post)
            session.flush()
            return post.id

    async def get_post_by_id(self, id: int):
        async with session_scope() as session:
            post = session.query(Post).filter(Post.id == id).first()
            post = {'id': post.id, 
                      'title': post.title, 
                      'description': post.description, 
                      'create_date': post.create_date, 
                      'creator_id': post.creator_id
                     }
            return post    
        
    async def get_posts_id_by_creator_id(self, id):
        async with session_scope() as session:
            posts = [post.id for post in session\
                       .query(Post)\
                       .filter(Post.creator_id == id)\
                       .all()]
            if posts:
                return posts
            return [0]
             
    async def get_posts_by_creator_id(self, id):
        async with session_scope() as session:
            db_posts = session\
                       .query(Post)\
                       .filter(Post.creator_id == id)\
                       .all()
            posts = [{
                      'id': post.id, 
                      'title': post.title, 
                      'description': post.description, 
                      'create_date': post.create_date, 
                      'creator_id': post.creator_id
                    }
                     for post in db_posts]
            if posts:
                return posts
            return None

    async def delete_post_by_id(self, id: int):
        async with session_scope() as session:
            post = session.query(Post).get(id)
            if post:
                session.delete(post) 
                return True
            return False

    async def update_post_by_id(self, id: int, title, description):
        async with session_scope() as session:
            post = session.query(Post).get(id)
            if post:
                if title:
                    post.title = title
                if description:
                    post.description = description
                return True
            return False