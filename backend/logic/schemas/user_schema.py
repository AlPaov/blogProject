from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserBase(BaseModel):
    id: int
    login: str
    password: str
    mail: EmailStr
    username: str
    register_date: datetime

