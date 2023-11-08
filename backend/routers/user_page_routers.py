import sys
sys.path.append('C:/Users/horrr/OneDrive/Рабочий стол/blog/backend')
from fastapi import APIRouter, Depends
from logic.dtos.responses.post_responses import PostsResponse
from logic.dtos.responses.comment_responses import CommentResponse
from logic.dtos.requests.comment_requests import UpdateCommentRequest
from logic.dtos.responses.user_responses import UserInfoResponse
from logic.dtos.requests.post_requests import UpdatePostRequest, AddPostRequest
from logic.services.user_service import user_service
from auth.jwt_bearer import jwtBearer

router = APIRouter(
    prefix="/user/{user_id}",
    tags=['userpage'],
)
users_service = user_service()

@router.get('/')
async def get_user_info(user_id) -> UserInfoResponse:
    return await users_service.get_user_info(user_id)

@router.get('/posts')
async def get_user_posts(user_id, current_user_id) -> PostsResponse:
    return await users_service.get_user_posts(user_id, current_user_id)

@router.get('/comments')
async def get_user_comments(user_id, current_user_id) -> CommentResponse:
    return await users_service.get_user_comments(user_id, current_user_id)

@router.get('/following')
async def get_user_follows(user_id):
    return await users_service.get_user_follows(user_id)
    
@router.get('/followers')
async def get_user_followers(user_id):
    return await users_service.get_user_followers(user_id)

@router.get('/check-if-subscribed', dependencies=[Depends(jwtBearer())])
async def get_if_user_subscribed(user_id, subscribtion_id):
    return await users_service.get_if_user_subscribed(user_id, subscribtion_id)

@router.post('/p/add', dependencies=[Depends(jwtBearer())])
async def add_user_post(data: AddPostRequest):
    return await users_service.add_user_post(data)

@router.delete('/p/{post_id}', dependencies=[Depends(jwtBearer())])
async def delete_user_post(post_id):
    return await users_service.delete_user_post(post_id)

@router.delete('/c/{comment_id}', dependencies=[Depends(jwtBearer())])
async def delete_user_comment(comment_id):
    return await users_service.delete_user_comment(comment_id)

@router.delete('/f/{follow_id}', dependencies=[Depends(jwtBearer())])
async def delete_user_follow(user_id, follow_id):
    return await users_service.delete_user_follow(user_id, follow_id)

@router.delete('/fr/{follower_id}', dependencies=[Depends(jwtBearer())])
async def delete_user_follower(user_id, follower_id):
    return await users_service.delete_user_follower(user_id, follower_id)

@router.put('/p/{post_id}', dependencies=[Depends(jwtBearer())])
async def update_user_post(data: UpdatePostRequest):
    return await users_service.update_user_post(data)

@router.put('/c/{comment_id}', dependencies=[Depends(jwtBearer())])
async def update_user_comment(data: UpdateCommentRequest):
    return await users_service.update_user_comment(data)




# @router.get("/users/", tags=["users"])
# def read_users():
#     return [{"username": "Rick"}, {"username": "Morty"}]

# @router.post("/users/register")
# def register(login, password, mail, username):
#     user = User(
#                 login = login,
#                 password = password,
#                 mail = mail,
#                 username = username,
#                 register_date = datetime.datetime.now()
#             )
#     user1.add_user(user)
#     return {'Success'}
