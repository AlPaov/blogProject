import sys
sys.path.append('C:/Users/horrr/OneDrive/Рабочий стол/blog/backend')

from pydantic import BaseModel
from logic.schemas.comment_schema import CommentAllInfo


class CommentResponse(BaseModel):
    comments: list[CommentAllInfo]
    
    

