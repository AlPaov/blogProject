from pydantic import BaseModel, validator, EmailStr
from datetime import datetime
import re

class UserRegisterRequest(BaseModel):
    login: str
    password: str
    mail: EmailStr
    username: str
    register_date: datetime
    
    @validator('login')
    def validate_login(cls, value):
        if len(value) < 4:
            raise ValueError('Login must be at least 4 characters long')
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise ValueError('Login can only contain letters, numbers, and underscores')
        return value

    @validator('password')
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$', value):
            raise ValueError('Password must contain at least one letter, one number, and one special character')
        return value
    
    @validator('username')
    def validate_username(cls, value):
        if len(value) < 4:
            raise ValueError('Username must be at least 8 characters long')
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise ValueError('Username can only contain letters, numbers, and underscores')
        return value
    
class UserLoginRequest(BaseModel):
    login_or_email: str
    password: str

    @validator('login_or_email')
    def validate_login_or_email(cls, value):
        if len(value) < 4 and not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise ValueError("Вы неверно указали логин или почту")
        return value

    @validator('password')
    def validate_password(cls, value):
        if len(value) < 8 and not re.match(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$', value):
            raise ValueError("Вы неправильно ввели пароль")   
        return value
    
class SubscribeRequest(BaseModel):
    user_id: int
    follow_id: int
    
class UpdatePasswordRequest(BaseModel):
    id: int
    password: str
    new_password: str
    
    @validator('new_password')
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$', value):
            raise ValueError('Password must contain at least one letter, one number, and one special character')
        return value
    
    def set_password(self, hashed_password):
        self.new_password = hashed_password
    
class UpdateEmailRequest(BaseModel):
    id: int
    mail: EmailStr
    password: str
    
class UpdateUsernameRequest(BaseModel):
    id: int
    username: str
    password: str
    
    @validator('username')
    def validate_username(cls, value):
        if len(value) < 4:
            raise ValueError('Username must be at least 8 characters long')
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise ValueError('Username can only contain letters, numbers, and underscores')
        return value
    