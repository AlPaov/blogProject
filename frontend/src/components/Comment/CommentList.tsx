import React, { useState, useEffect } from 'react';
import CommentDeleteButton from './DeleteButtonComponent';
import { Comment } from '../types';
import { useHttp } from '../../api/httpHook';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../../features/auth/authSlice';

interface CommentsProps {
    comments: Comment[];
    onDeleteComment: (commentId: number) => void;
    clickableComment: boolean;
}

const Comments: React.FC<CommentsProps> = ({ comments, onDeleteComment, clickableComment }) => {
    const [commentsData, setCommentsData] = useState<Comment[]>(comments);
    const currentUserId = useSelector(selectCurrentUser);
    const { request } = useHttp();


    useEffect(() => {
        setCommentsData(comments);
        console.log(comments)
    }, [comments]);

    const handleLikeOrDislike = async (
        commentId: number,
        postId: number,
        actionType: 'like' | 'dislike',
    ) => {
        try {
            const currentStatus = commentsData.find((comment) => comment.id === commentId)?.like_or_dis;
            const currentGrade = commentsData.find((comment) => comment.id === commentId)?.grade;
            let newGrade = currentGrade
            let newStatus: "like" | "dislike" | null;
            if (currentStatus === actionType) {
                newStatus = null;
                if (actionType === 'dislike') {
                    newGrade = (newGrade || 0) + 1
                } else {
                    newGrade = (newGrade || 0) - 1
                }
            } else {
                newStatus = actionType;
                if (actionType === 'dislike' && currentStatus != 'like') {
                    newGrade = (newGrade || 0) - 1
                } else if (actionType === 'dislike' && currentStatus === 'like') {
                    newGrade = (newGrade || 0) - 2
                } else if (actionType === 'like' && currentStatus === 'dislike') {
                    newGrade = (newGrade || 0) + 2
                } else {
                    newGrade = (newGrade || 0) + 1
                }

            }
            await request(`http://127.0.0.1:8000/p/${postId}/${commentId}/like`, 'POST', JSON.stringify({
                type: actionType,
                comment_id: commentId,
                user_id: currentUserId,
            }));

            const updatedCommentsData = commentsData.map((comment) => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        like_or_dis: newStatus,
                        grade: newGrade || 0,
                    };
                }
                return comment;
            });

            setCommentsData(updatedCommentsData);
            console.log(comments)
        } catch (error) {
            console.error(`Error while ${actionType === 'like' ? 'liking' : 'disliking'} the comment:`, error);
        }
    };

    return (
        <div>
            {commentsData.map((comment) => (
                <div>
                    {comment.creator_id ? (
                        <Link to={`/user/${comment.creator_id}`} className="text-sm text-gray mr-5">
                            {comment.creator_username}
                        </Link>
                    ) : (
                        <span className="text-sm text-gray mr-5">Deleted user</span>
                    )}

                    <div>
                        <div key={comment.id} className="border p-4 p rounded mb-4">
                            {clickableComment ? (
                                <Link to={`/p/${comment.post_id}/`}>
                                    <h3>{comment.text}</h3>
                                </Link>
                            ) : (
                                <h3>{comment.text}</h3>
                            )}


                            <p className="text-gray-600">Create date: {new Date(comment.create_date).toLocaleString()}</p>

                            <div className='flex justify-between max-h-9 max-w-[240px] w-full'>
                                <div className='flex justify-between w-full'>
                                    <button
                                        className={`text-white px-2 py-1 rounded hover:bg-blue-300 transition-colors 
        border border border-transparent hover:border-black
${comment.like_or_dis === "like" ? 'bg-blue-300' : 'bg-blue-500'}`}
                                        onClick={() => handleLikeOrDislike(comment.id, comment.post_id, "like")}
                                    >
                                        Like
                                    </button>
                                    <button
                                        className={`text-white px-2 py-1 ml-1 mr-1 rounded hover:bg-red-300 transition-colors border
        border border border-transparent hover:border-black
${comment.like_or_dis === "dislike" ? 'bg-red-300' : 'bg-red-500'}`}
                                        onClick={() => handleLikeOrDislike(comment.id, comment.post_id, "dislike")}
                                    >
                                        Dislike
                                    </button>
                                </div>

                                <span className='py-1 max-w-100 w-full'> Rating: {comment.grade}</span>

                            </div>
                            {comment.creator_id === currentUserId && (
                                <CommentDeleteButton onDeleteClick={() => onDeleteComment(comment.id)} />
                            )}
                        </div>
                    </div>
                </div>

            ))
            }
        </div >
    );
};

export default Comments;