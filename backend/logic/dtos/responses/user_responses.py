import sys
sys.path.append('C:/Users/horrr/OneDrive/Рабочий стол/blog/backend')

from pydantic import BaseModel
from datetime import datetime

class UserInfoResponse(BaseModel):
    username: str
    register_date: datetime
    followers: int | None
    following: int | None
    karma: int | None