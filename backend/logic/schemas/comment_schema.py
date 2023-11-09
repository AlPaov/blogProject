from pydantic import BaseModel
from datetime import datetime


class CommentAllInfo(BaseModel):
    id: int
    creator_id: int | None
    post_id: int 
    text: str
    create_date: datetime
    grade: int | None
    like_or_dis: str | None
    creator_username: str | None