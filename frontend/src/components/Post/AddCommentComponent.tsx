import React, { useState } from 'react';
import { useHttp } from '../../api/httpHook';
import { Comment } from '../types';

interface AddCommentProps {
    postId: number;
    currentUserId: number | null;
    onCommentAdded: (comment: Comment) => void;
}

const AddComment: React.FC<AddCommentProps> = ({ postId, currentUserId, onCommentAdded }) => {
    const [commentText, setCommentText] = useState('');
    const { request } = useHttp();

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const requestBody = {
                creator_id: currentUserId,
                post_id: postId,
                text: commentText,
                create_date: new Date().toISOString(),
                grade: null,
                like_or_dis: null,
            };

            const response = await request(`http://127.0.0.1:8000/p/${postId}/add_comment`, 'POST', JSON.stringify(requestBody));

            const newComment: Comment = response;

            setCommentText('');

            onCommentAdded(newComment);
        } catch (error) {
            console.error('Error while adding comment:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleCommentSubmit} className="mt-4">
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Your comment..."
                    rows={3}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <button
                    type="submit"
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                    Add comment
                </button>
            </form>
        </div>
    );
};

export default AddComment;