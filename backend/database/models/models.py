import sys
sys.path.append('C:/Users/horrr/OneDrive/Рабочий стол/blog/backend')

import passlib.hash as _hash
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from database.connection import Base


class User(Base):
    __tablename__ = 'Users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    login = Column(String(50), nullable=False)
    password = Column(String(60), nullable=False)
    mail = Column(String(50), nullable=False)
    username = Column(String(50), nullable=False)
    register_date = Column(DateTime, nullable=False)

    post_creator = relationship('Post', back_populates='creator')
    comment_creator = relationship('Comment', back_populates='creator', cascade='all, delete-orphan')
    liked_com = relationship('Comment_grades', back_populates='user_liked')
    liked_posts = relationship('Post_grades', back_populates='user_liked', cascade='all, delete-orphan')
    user_sub = relationship('Subscription', foreign_keys='Subscription.user_id', back_populates='user')
    user_follows = relationship('Subscription', foreign_keys='Subscription.follow_id', back_populates='user_follow')
    
class Post(Base):
    __tablename__ = 'Posts'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(50), nullable=False)
    description = Column(String(2000), nullable=False)
    create_date = Column(DateTime, nullable=False)
    creator_id = Column(Integer, ForeignKey('Users.id', ondelete='SET NULL'), nullable=True) 
    
    creator = relationship('User', back_populates='post_creator')
    post_comment = relationship('Comment', back_populates='post', cascade='all, delete-orphan')
    grade = relationship('Post_grades', back_populates='liked_post', cascade='all, delete-orphan')
    
class Comment(Base):
    __tablename__ = 'Comments'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    text = Column(String(200, collation='Cyrillic_General_CI_AS'), nullable=False)
    create_date = Column(DateTime, nullable=False)
    creator_id = Column(Integer, ForeignKey('Users.id', ondelete='SET NULL'), nullable=True)
    post_id = Column(Integer, ForeignKey('Posts.id', ondelete='CASCADE'), nullable=False)
    
    creator = relationship('User', back_populates='comment_creator')
    post = relationship('Post', back_populates='post_comment')
    comment_grade = relationship('Comment_grades', back_populates='comment_liked', cascade='all, delete-orphan')
    
class Comment_grades(Base):
    __tablename__ = 'Comments_grades'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(String(8), nullable=False)
    comment_id = Column(Integer, ForeignKey('Comments.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(Integer, ForeignKey('Users.id', ondelete='SET NULL'), nullable=True)
    
    comment_liked = relationship('Comment', back_populates='comment_grade')
    user_liked = relationship('User', back_populates='liked_com')

class Post_grades(Base):
    __tablename__ = 'Posts_grades'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(String(8), nullable=False)
    post_id = Column(Integer, ForeignKey('Posts.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(Integer, ForeignKey('Users.id', ondelete='SET NULL'), nullable=True)
    
    liked_post = relationship('Post', back_populates='grade')
    user_liked = relationship('User', back_populates='liked_posts')
    
class Subscription(Base):
    __tablename__ = 'Subscriptions'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('Users.id', ondelete='CASCADE'), nullable=False) 
    follow_id = Column(Integer, ForeignKey('Users.id', ondelete='NO ACTION'), nullable=False) 
    
    user = relationship('User', foreign_keys=[user_id], back_populates='user_sub')
    user_follow = relationship('User', foreign_keys=[follow_id], back_populates='user_follows')