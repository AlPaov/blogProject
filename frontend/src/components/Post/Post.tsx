import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '../../api/httpHook';
import Comments from '../Comment/CommentList';
import AllPostInfo, { Post } from './AllPostInfo';
import { useSelector } from 'react-redux';
import { RootState, setPostStatus, setSubscriptionStatus, useAppDispatch } from '../../redux/store';
import AddComment from './AddCommentComponent';
import { Comment } from '../types';
import { selectCurrentUser } from '../../features/auth/authSlice';

const PostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const posts = useSelector((state: RootState) => state.app.posts);
    const current_user_id = useSelector(selectCurrentUser);
    const [comments, setComments] = useState<Comment[]>([]);
    const [current_post, setPost] = useState<Post>();
    const postStatus = useSelector((state: RootState) => state.app.postStatus);
    const subscriptionStatus = useSelector((state: RootState) => state.app.subscriptionStatus);
    const dispatch = useAppDispatch();
    const { request } = useHttp();

    useEffect(() => {
        fetchPostAndComments();
    }, [current_user_id, posts]);

    const fetchPostAndComments = async () => {
        try {
            const postData = await request(`http://127.0.0.1:8000/p/${postId}/?user_id=${current_user_id}`);
            const updatedPostStatus = {
                ...postStatus,
                [postData.post.id]: postData.post.like_or_dis,
            };
            const initialSubscriptionStatus = {
                ...subscriptionStatus,
                [postData.post.id]: postData.post.subscribed,
            };
            setPost(postData.post);
            dispatch(setPostStatus(updatedPostStatus))
            dispatch(setSubscriptionStatus(initialSubscriptionStatus))
            const commentsData = await request(`http://127.0.0.1:8000/p/${postId}/comments?user_id=${postData.post.creator_id}&current_user_id=${current_user_id}`);
            setComments(commentsData.comments);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleCommentAdded = async (newComment: Comment) => {
        const commentsData = await request(`http://127.0.0.1:8000/p/${postId}/comments?user_id=${current_post?.creator_id}&current_user_id=${current_user_id}`);
        setComments(commentsData.comments);
    };

    const onDeleteComment = async (commentId: number) => {
        try {
            await request(`http://127.0.0.1:8000/p/${postId}/${commentId}/delete`, 'DELETE');
            const commentsData = await request(`http://127.0.0.1:8000/p/${postId}/comments?user_id=${current_post?.creator_id}&current_user_id=${current_user_id}`);
            setComments(commentsData.comments);
        } catch (error) {
            console.error('Error while deleting comment:', error);
        }
    };

    return (
        <div className="flex justify-center">
            <div className="p-4 max-w-[1000px] w-full">
                <h1 className="text-2xl font-semibold mb-4">Post</h1>
                <AllPostInfo
                    posts={current_post ? [current_post] : []}
                    homeTabState={0}
                    showLikeButtons={true}
                    showSubscribeButton={current_user_id == current_post?.creator_id ? false : true}
                    disableCommentsLink={true}
                />
                <h1 className="text-2xl font-semibold mb-4">Comments</h1>
                {comments.length > 0 ? (
                    <Comments comments={comments} onDeleteComment={onDeleteComment} clickableComment={false} />
                ) : (
                    <p>No comments available.</p>
                )}
                <AddComment postId={Number(postId)} currentUserId={current_user_id} onCommentAdded={handleCommentAdded} />
            </div>
        </div>
    );
};

export default PostPage;