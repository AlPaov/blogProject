import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../../features/auth/authSlice';
import { useHttp } from '../../api/httpHook';
import Cookies from 'js-cookie';

const RegisterForm: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { request } = useHttp();
    const [errMsg, setErrMsg] = useState('')
    const [login, setLogin] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')


    useEffect(() => {
        setErrMsg('')
    }, [password, username, email, login])

    const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const userData = await request(`http://127.0.0.1:8000/register`, 'POST', JSON.stringify({
                login: login,
                password: password,
                mail: email,
                username: username,
                register_date: Date.now()
            }));
            if (userData['access_token']) {
                dispatch(setCredentials({ user: userData['user_id'], accessToken: userData["access_token"] }))
                setLogin('')
                setEmail('')
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
            case "login":
                setLogin(event.currentTarget.value)
                break;
            case "email":
                setEmail(event.currentTarget.value)
                break;
            case "password":
                setPassword(event.currentTarget.value)
                break;
            case "username":
                setUsername(event.currentTarget.value)
                break;
        }
    }

    return (
        <form onSubmit={onSubmitHandler}>
            <div className="max-w-md mx-auto mt-8 p-4 border rounded-lg bg-white">
                <h2 className="text-2xl font-semibold mb-4">Registration</h2>
                <input
                    type="text"
                    placeholder="Login"
                    className="w-full p-2 mb-4 border rounded"
                    onChange={(event) => {
                        onChangeForm("login", event)
                    }}
                />
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-2 mb-4 border rounded"
                    onChange={(event) => {
                        onChangeForm("username", event)
                    }}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 mb-4 border rounded"
                    onChange={(event) => {
                        onChangeForm("email", event)
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
                    type="submit">
                    Register
                </button>
            </div>
        </form>
    );
};

export default RegisterForm;