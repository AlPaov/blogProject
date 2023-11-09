from pydantic import BaseModel
from datetime import datetime


class UserInfoResponse(BaseModel):
    username: str
    register_date: datetime
    followers: int | None
    following: int | None
    karma: int | None