from fastapi import APIRouter, Depends
from logic.services.post_service import post_service
from logic.dtos.responses.post_responses import PostResponse
from logic.dtos.responses.comment_responses import CommentResponse
from logic.dtos.requests.comment_requests import AddCommentRequest, LikeCommentRequest, UpdateCommentRequest
from auth.jwt_bearer import jwtBearer


router = APIRouter(
    prefix="/p/{post_id}",
    tags=['post'],
)

post_page = post_service()

@router.get('/', response_model=PostResponse)
async def get_post(post_id, user_id: int):
    result = await post_page.get_post_info(user_id, post_id)
    return PostResponse(post=result)

@router.get('/comments', response_model=CommentResponse)
async def get_comments(post_id, user_id, current_user_id):
    result = await post_page.get_comments(current_user_id, user_id, post_id)
    return result

@router.get('/{comment_id}')
async def get_comment(comment_id):
    return await post_page.get_comment_by_id(comment_id)

@router.post('/add_comment', dependencies=[Depends(jwtBearer())])
async def add_comment(data: AddCommentRequest):
    return await post_page.add_comment(data)

@router.post('/{comment_id}/like', dependencies=[Depends(jwtBearer())])
async def like_comment(data: LikeCommentRequest):
    return await post_page.like_comment(data)

@router.delete('/{comment_id}/delete', dependencies=[Depends(jwtBearer())])
async def delete_comment(comment_id):
    return await post_page.delete_comment(comment_id)

@router.put('/{comment_id}/update', dependencies=[Depends(jwtBearer())])
async def update_comment(data: UpdateCommentRequest):
    return await post_page.update_comment(data)




