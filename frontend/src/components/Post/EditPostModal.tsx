import React, { useState, ChangeEvent } from 'react';
import { useHttp } from '../../api/httpHook';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setPosts } from '../../redux/store';
interface EditPostModalProps {
    post: { id: number, title: string; description: string };
    onClose: () => void;
    userId: number | null;
    postId: number;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ post, onClose, userId, postId }) => {
    const [editedPost, setEditedPost] = useState({ id: post.id, title: post.title, description: post.description });
    const GlobalPosts = useSelector((state: RootState) => state.app.posts);
    const { request } = useHttp();
    const dispatch = useDispatch();
    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEditedPost({ ...editedPost, title: e.target.value });
    };

    const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setEditedPost({ ...editedPost, description: e.target.value });
    };

    const handleSave = async () => {
        try {

            await request(`http://127.0.0.1:8000/user/${userId}/p/${postId}`, 'PUT', JSON.stringify(editedPost));
            onClose();
            const updatedPosts = GlobalPosts.map((p) => {
                if (p.id === postId) {
                    return { ...p, ...editedPost };
                }
                return p;
            });

            dispatch(setPosts(updatedPosts));
        } catch (error) {
            console.error('Error while updating the post:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded max-w-xl w-full shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Edit Post</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        placeholder="Title"
                        value={editedPost.title}
                        onChange={handleTitleChange}
                    />
                </div>
                <div className="mb-4">
                    <textarea
                        className="w-full border rounded p-2"
                        placeholder="Description"
                        value={editedPost.description}
                        onChange={handleDescriptionChange}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                    <button
                        className="px-4 py-2 ml-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPostModal;