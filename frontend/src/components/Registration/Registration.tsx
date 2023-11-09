import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../../features/auth/authSlice';
import { useHttp } from '../../api/httpHook';
import Cookies from 'js-cookie';
import { useForm, SubmitHandler } from 'react-hook-form';

interface RegisterFormProps {
    login: string;
    username: string;
    mail: string;
    password: string;
    register_date: number;
}

const RegisterForm: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { request } = useHttp();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormProps>({
        mode: "onBlur"
    });

    const onSubmitHandler: SubmitHandler<RegisterFormProps> = async (data) => {
        try {
            data.register_date = Date.now();
            const userData = await request(
                'http://127.0.0.1:8000/register',
                'POST',
                JSON.stringify(data)
            );

            if (userData['access_token']) {
                dispatch(
                    setCredentials({ user: userData['user_id'], accessToken: userData['access_token'] })
                );
                Cookies.set('auth_token', userData['access_token']);
                navigate('/home');
            }
        } catch (err: any) {
            if (err.status == 400) {
                console.log(err)
                if (err.body == 'Login already used') {
                    alert('Login already used');
                } else if (err.body == 'Email already used') {
                    alert('Email already used');
                } else if (err.response.status === 401) {
                    alert('Unauthorized');
                } else {
                    alert('Login Failed');
                }
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="max-w-md mx-auto mt-8 p-4 border rounded-lg bg-white">
                <h2 className="text-2xl font-semibold mb-4">Registration</h2>
                <input
                    id="login"
                    type="text"
                    placeholder="Login"
                    className={`w-full p-2 border mb-4 rounded ${errors.login ? 'border-red-500 mb-0' : ''}`}
                    {...register('login', {
                        required: 'Login field is required',
                        minLength: { value: 4, message: 'Login must be at least 4 characters long' },
                        pattern: {
                            value: /^[a-zA-Z0-9_]+$/,
                            message: 'Login can only contain letters, numbers, and underscores',
                        },
                    })}
                />
                {errors.login && <p className="text-red-500 mb-1 h-7">{errors.login.message}</p>}

                <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    className={`w-full p-2 border mb-4 rounded ${errors.username ? 'border-red-500 mb-0' : ''}`}
                    {...register('username', {
                        required: 'Username field is required',
                        minLength: { value: 4, message: 'Username must be at least 4 characters long' },
                        pattern: {
                            value: /^[a-zA-Z0-9_]+$/,
                            message: 'Username can only contain letters, numbers, and underscores',
                        },
                    })}
                />
                {errors.username && <p className="text-red-500 mb-1 h-7">{errors.username.message}</p>}

                <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    className={`w-full p-2 border mb-4 rounded ${errors.mail ? 'border-red-500 mb-0' : ''}`}
                    {...register('mail', {
                        required: 'Email field is required',
                    })}
                />
                {errors.mail && <p className="text-red-500 mb-1 h-7">{errors.mail.message}</p>}

                <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    className={`w-full p-2 border mb-4 rounded ${errors.password ? 'border-red-500 mb-0' : ''}`}
                    {...register('password', {
                        required: 'Password field is required',
                        minLength: { value: 8, message: 'Password must be at least 8 characters long' },
                        pattern: {
                            value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$/,
                            message: 'Password must contain at least one letter, one number, and one special character',
                        },
                    })}
                />
                {errors.password && <p className="text-red-500 mb-1 h-7">{errors.password.message}</p>}

                <button
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    Register
                </button>
            </div>
        </form>
    );
};

export default RegisterForm;