from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .jwt_handler import decodeJWT

class jwtBearer(HTTPBearer):
    def __init__(self, auto_Error : bool = True):
        super(jwtBearer, self).__init__(auto_error=auto_Error)
        
    async def __call__(self, request: Request):
        credentails: HTTPAuthorizationCredentials = await super(jwtBearer, self).__call__(request)
        if credentails:
            if not credentails.scheme == "Bearer":
                raise HTTPException(status_code=403, detail={"status":"Forbidden", "message":"Invalid authenticational scheme"})
            if not self.verify_jwt(credentails.credentials):
                raise HTTPException(status_code=403, detail={"status":"Forbidden", "message":"Invalid or Expired Token!"})
            return credentails.credentials
        else:
            raise HTTPException(status_code=403, detail={"status":"Forbidden", "message":"Invalid authorization code!"})
        
    def verify_jwt(self, jwt_token:str):
        isTokenValid: bool = False
        payload = decodeJWT(jwt_token)
        if payload:
            isTokenValid = True
        return isTokenValid
    