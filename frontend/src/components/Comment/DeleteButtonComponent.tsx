import React from 'react';

interface CommentDeleteButtonProps {
    onDeleteClick: () => void;
}

const CommentDeleteButton: React.FC<CommentDeleteButtonProps> = ({ onDeleteClick }) => {
    return (
        <button
            onClick={onDeleteClick}
            className="text-red-500 hover:text-red-600 focus:outline-none"
        >
            Delete
        </button>
    );
};

export default CommentDeleteButton;