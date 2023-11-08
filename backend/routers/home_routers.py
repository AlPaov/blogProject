import sys
sys.path.append('C:/Users/horrr/OneDrive/Рабочий стол/blog/backend')


from fastapi import APIRouter, Depends
from logic.services.homepage_service import Homepage_service
from logic.dtos.responses.post_responses import PostsResponse
from logic.dtos.requests.post_requests import post_grade_request
from logic.dtos.requests.user_requests import SubscribeRequest
from auth.jwt_bearer import jwtBearer

router = APIRouter(    
    prefix="/home/{user_id}",
    tags=['home'],
    )
homepage = Homepage_service()

@router.get('/', response_model=PostsResponse)
async def get_homepage(user_id, subs: int = 0):
    return await homepage.get_posts(user_id, subs)

@router.post('/rate/', dependencies=[Depends(jwtBearer())])
async def grade_post(data: post_grade_request):
    return await homepage.like_post(data)


@router.post('/subscribe/', dependencies=[Depends(jwtBearer())])
async def subscribe(data: SubscribeRequest):
    return await homepage.subscribe(data)



