from pydantic import BaseModel
from logic.schemas.comment_schema import CommentAllInfo


class CommentResponse(BaseModel):
    comments: list[CommentAllInfo]
    
    

