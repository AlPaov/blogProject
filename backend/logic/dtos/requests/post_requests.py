from pydantic import BaseModel, validator
from datetime import datetime
import re


class post_grade_request(BaseModel):
    user_id: int
    post_id: int
    type: str
    
    @validator('type')
    def validate_grade_type(cls, value):
        if not re.match(r'^(like|dislike)$', value):
            raise ValueError("Invalid 'type'. It must be 'like' or 'dislike'")
        return value

class AddPostRequest(BaseModel):
    title: str
    description: str 
    create_date: datetime
    creator_id: int | None

class post_data_request(BaseModel):
    user_id: int
    subs: str | None = None
    
class UpdatePostRequest(BaseModel):
    id: int
    title: str
    description: str