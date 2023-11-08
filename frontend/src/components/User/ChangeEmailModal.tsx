
import React, { useState } from 'react';

interface ChangeEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (currentPassword: string, newEmail: string) => void;
}

const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');

    const handleSubmit = () => {
        onSubmit(currentPassword, newEmail);
        onClose();
    };

    return (
        <div>
            {isOpen && (
                <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
                    <div className="modal-container bg-white p-4 rounded shadow-md max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">Change Email</h2>
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="input-field border rounded block mb-4 p-2 disabled:opacity-75"
                        />
                        <input
                            type="email"
                            placeholder="New Email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="input-field border rounded block mb-4 p-2 disabled:opacity-75"
                        />
                        <div className='flex justify-between'>
                            <button onClick={handleSubmit} className="submit-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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

export default ChangeEmailModal;