
import React, { useState } from 'react';

interface ChangeUsernameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (currentPassword: string, newUsername: string) => void;
}

const ChangeUsernameModal: React.FC<ChangeUsernameModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');

    const handleSubmit = () => {
        onSubmit(currentPassword, newUsername);
        onClose();
    };

    return (
        <div>
            {isOpen && (
                <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
                    <div className="modal-container bg-white p-4 rounded shadow-md max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">Change Username</h2>
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="input-field border rounded block mb-4 p-2 disabled:opacity-75"
                        />
                        <input
                            type="text"
                            placeholder="New Username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="input-field border rounded block mb-4 p-2 disabled:opacity-75"
                        />
                        <div className='flex justify-between'>
                            <button onClick={handleSubmit} className="submit-button bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Submit
                            </button>
                            <button onClick={onClose} className="cancel-button bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChangeUsernameModal;