from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    id: int
    login: str
    password: str
    mail: EmailStr
    username: str
    register_date: datetime


class UserInfoAll(BaseModel):
    username: str
    followers: int
    following: int
    register_date: datetime
    karma: int