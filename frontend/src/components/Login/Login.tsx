import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useHttp } from '../../api/httpHook';
import { setCredentials } from '../../features/auth/authSlice';
import { useLoginMutation } from '../../features/auth/authApiSlice';

const LoginForm: React.FC = () => {
    const [errMsg, setErrMsg] = useState('')
    const [login_or_email, setLoginOrEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const [login, { isLoading }] = useLoginMutation()

    const dispatch = useDispatch();

    useEffect(() => {
        setErrMsg('')
    }, [login_or_email, password])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            const userData = await login({ login_or_email, password }).unwrap()
            if (userData['access_token']) {
                dispatch(setCredentials({ user: userData['user_id'], accessToken: userData["access_token"] }))
                setLoginOrEmail('')
                setPassword('')
                Cookies.set("auth_token", userData["access_token"])
                navigate('/home')
            }
        } catch (err: any) {
            if (!err?.data) {
                setErrMsg('No Server Response');
            } else if (err.originalStatus === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.originalStatus === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
        }

    }


    const onChangeForm = (label: string, event: React.ChangeEvent<HTMLInputElement>) => {
        switch (label) {
            case "login_or_email":
                setLoginOrEmail(event.currentTarget.value)
                break;
            case "password":
                setPassword(event.currentTarget.value)
                break;
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="max-w-md mx-auto mt-8 p-4 border rounded-lg bg-white">
                <h2 className="text-2xl font-semibold mb-4">Login or Email</h2>
                <input
                    placeholder="Email or Login"
                    className="w-full p-2 mb-4 border rounded"
                    onChange={(event) => {
                        onChangeForm("login_or_email", event)
                    }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-4 border rounded"
                    onChange={(event) => {
                        onChangeForm("password", event)
                    }}
                />
                <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type='submit'>
                    Login
                </button>
            </div>
        </form>
    );
};

export default LoginForm;