import sys
sys.path.append('C:/Users/horrr/OneDrive/Рабочий стол/blog/backend')

from pydantic import BaseModel
from logic.schemas.post_schema import PostAllInfo


class PostsResponse(BaseModel):
    posts: list[PostAllInfo]
    
class PostResponse(BaseModel):
    post: PostAllInfo
    
    

