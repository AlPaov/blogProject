from pydantic import BaseModel, validator
from datetime import datetime
import re

class AddCommentRequest(BaseModel):
    creator_id: int | None
    post_id: int 
    text: str
    create_date: datetime
    
class LikeCommentRequest(BaseModel):
    type: str
    comment_id: int
    user_id: int
    
    @validator('type')
    def validate_grade_type(cls, value):
        if not re.match(r'^(like|dislike)$', value):
            raise ValueError("Invalid 'type'. It must be 'like' or 'dislike'")
        return value

class UpdateCommentRequest(BaseModel):
    comment_id: int
    text: str