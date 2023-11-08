import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ChangeEmailModal from './ChangeEmailModal';
import ChangePasswordModal from './ChangePasswordModal';
import ChangeUsernameModal from './ChangeUsernameModal';
import { selectCurrentToken, selectCurrentUser } from '../../features/auth/authSlice';

const UserSettingsPage: React.FC = () => {
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [usernameModalOpen, setUsernameModalOpen] = useState(false);
    const current_token = useSelector(selectCurrentToken)
    const current_user_id = useSelector(selectCurrentUser)

    const handleEmailSubmit = async (currentPassword: string, newEmail: string) => {
        try {
            const userId = current_user_id;
            const response = await fetch(`http://127.0.0.1:8000/user/${userId}/settings/update_email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${current_token}`,
                },
                body: JSON.stringify({
                    id: userId,
                    mail: newEmail,
                    password: currentPassword
                }),
            });
            if (response.ok) {

            } else {

            }
        } catch (error) {

        }
    };

    const handlePasswordSubmit = async (currentPassword: string, newPassword: string) => {
        try {
            const userId = current_user_id;
            const response = await fetch(`http://127.0.0.1:8000/user/${userId}/settings/update_password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${current_token}`,
                },
                body: JSON.stringify({
                    id: userId,
                    password: currentPassword,
                    new_password: newPassword
                }),
            });
            if (response.ok) {

            } else {
            }
        } catch (error) {

        }
    };

    const handleUsernameSubmit = async (currentPassword: string, newUsername: string) => {
        try {
            const userId = current_user_id;
            const response = await fetch(`http://127.0.0.1:8000/user/${userId}/settings/update_username`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${current_token}`,
                },
                body: JSON.stringify({
                    id: userId,
                    password: currentPassword,
                    username: newUsername,
                }),
            });
            if (response.ok) {

            } else {

            }
        } catch (error) {

        }
    };

    return (

        <div className="flex items-center justify-center mt-20">
            <div className="bg-white p-4 rounded shadow-md max-w-sm">
                <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-lg">Email address:</span>
                        <button
                            onClick={() => setEmailModalOpen(true)}
                            className="bg-blue-500 ml-10 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                        >
                            Change
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-lg">Change password:</span>
                        <button
                            onClick={() => setPasswordModalOpen(true)}
                            className="bg-blue-500 ml-10 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                        >
                            Change
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-lg">Change Username:</span>
                        <button
                            onClick={() => setUsernameModalOpen(true)}
                            className="bg-blue-500 ml-10 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                        >
                            Change
                        </button>
                    </div>
                </div>
            </div>

            <ChangeEmailModal
                isOpen={emailModalOpen}
                onClose={() => setEmailModalOpen(false)}
                onSubmit={handleEmailSubmit}
            />

            <ChangePasswordModal
                isOpen={passwordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
                onSubmit={handlePasswordSubmit}
            />

            <ChangeUsernameModal
                isOpen={usernameModalOpen}
                onClose={() => setUsernameModalOpen(false)}
                onSubmit={handleUsernameSubmit}
            />
        </div>




    );
};

export default UserSettingsPage;