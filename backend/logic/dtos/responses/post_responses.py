from pydantic import BaseModel
from logic.schemas.post_schema import PostAllInfo


class PostsResponse(BaseModel):
    posts: list[PostAllInfo]
    
class PostResponse(BaseModel):
    post: PostAllInfo
    
    

