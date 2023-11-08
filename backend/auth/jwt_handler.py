import time
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("SECRET_KEY")
JWT_ALGORITHM = os.getenv("ALGORITHM")
JWT_ACCESS_TOKEN_EXPIRE_SECONDS = os.getenv("ACCESS_TOKEN_EXPIRE_SECONDS")

def token_response(token: str):
    return {
        "access_token" : token
    }
    
def signJWT(user_id: str):
    payload = {
        "user_id": user_id,
        "exp" : time.time() + int(JWT_ACCESS_TOKEN_EXPIRE_SECONDS),
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token_response(token)

def decodeJWT(token: str):
    try:
        decode_token = jwt.decode(token, JWT_SECRET, algorithms=JWT_ALGORITHM)
        return decode_token if decode_token["exp"] >= time.time() else None
    except:
        return {}