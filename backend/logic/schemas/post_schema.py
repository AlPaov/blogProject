from pydantic import BaseModel
from datetime import datetime

class Post(BaseModel):
    id: int
    title: str
    description: str 
    create_date: datetime
    creator_id: int | None
    
class PostAllInfo(BaseModel):
    id: int
    title: str
    description: str 
    create_date: datetime
    creator_username: str | None
    creator_id: int | None
    comments_count: int | None
    grade: int | None
    subscribed: bool | None
    like_or_dis: str | None

class PostFollowed(BaseModel):
    id: int
    title: str
    description: str 
    create_date: datetime
    creator_id: int | None
    comments_count: int
    grade: int
    subscribed: str
    