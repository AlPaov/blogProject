import React from 'react';

interface CreatePostButtonProps {
    onClick: () => void;
}

const CreatePostButton: React.FC<CreatePostButtonProps> = ({ onClick }) => {
    return (
        <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={onClick}
        >
            Create Post
        </button>
    );
};

export default CreatePostButton;