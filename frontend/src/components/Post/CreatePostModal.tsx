import React, { useState, ChangeEvent } from 'react';
import { useHttp } from '../../api/httpHook';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setPosts } from '../../redux/store';

interface CreatePostModalProps {
    userId: number;
    onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ userId, onClose }) => {
    const [newPost, setNewPost] = useState({
        title: '',
        description: '',
        create_date: new Date().toISOString(),
        creator_id: userId,
    });
    const GlobalPosts = useSelector((state: RootState) => state.app.posts);
    const { request } = useHttp();
    const dispatch = useDispatch();

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewPost({ ...newPost, title: e.target.value });
    };

    const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setNewPost({ ...newPost, description: e.target.value });
    };

    const handleCreate = async () => {
        try {
            const response = await request(`http://127.0.0.1:8000/user/${userId}/p/add`, 'POST', JSON.stringify(newPost));
            console.log(response)
            const createdPost = await request(`http://127.0.0.1:8000/p/${response}/?user_id=${userId}`)
            onClose();

            dispatch(setPosts([...GlobalPosts, createdPost]));
            console.log(GlobalPosts)

        } catch (error) {
            console.error('Error while creating the post:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded max-w-xl w-full shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Create Post</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        placeholder="Title"
                        value={newPost.title}
                        onChange={handleTitleChange}
                    />
                </div>
                <div className="mb-4">
                    <textarea
                        className="w-full border rounded p-2"
                        placeholder="Description"
                        value={newPost.description}
                        onChange={handleDescriptionChange}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleCreate}
                    >
                        Create
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

export default CreatePostModal;