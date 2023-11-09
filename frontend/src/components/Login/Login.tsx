import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';
import { useLoginMutation } from '../../features/auth/authApiSlice';
import { useForm, SubmitHandler } from 'react-hook-form';

interface LoginFormProps {
    login_or_email: string;
    password: string;
}


const LoginForm: React.FC = () => {
    const [errMsg, setErrMsg] = useState('')
    const navigate = useNavigate()
    const [login, { isLoading }] = useLoginMutation()
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormProps>({
        mode: "onBlur"
    });

    useEffect(() => {
        setErrMsg('')
    }, [])

    const onHandleSubmit: SubmitHandler<LoginFormProps> = async (data) => {

        try {
            const userData = await login(data).unwrap()
            if (userData['access_token']) {
                dispatch(setCredentials({ user: userData['user_id'], accessToken: userData["access_token"] }))
                Cookies.set("auth_token", userData["access_token"])
                navigate('/home')
            }
        } catch (err: any) {
            if (err.status == 400) {
                alert('No Server Response');
            } else if (err.status == 401) {
                alert(err.data.detail)
            } else {
                alert('Login Failed');
            }
        }

    }


    return (
        <form onSubmit={handleSubmit(onHandleSubmit)}>
            <div className="max-w-md mx-auto mt-8 p-4 border rounded-lg bg-white">
                <h2 className="text-2xl font-semibold mb-4">Login or Email</h2>
                <input
                    placeholder="Email or Login"
                    className={`w-full p-2 mb-4 border rounded ${errors.login_or_email ? 'border-red-500 mb-0' : ''}`}
                    {...register('login_or_email', {
                        required: 'Login field is required',
                        minLength: { value: 4, message: 'Login must be at least 4 characters long' },
                        pattern: {
                            value: /^[a-zA-Z0-9_]+$/,
                            message: 'Login or email can only contain letters, numbers, and underscores',
                        },
                    })}
                />
                {errors.login_or_email && <p className="text-red-500 mb-1 h-7">{errors.login_or_email.message}</p>}
                <input
                    type="password"
                    placeholder="Password"
                    className={`w-full p-2 mb-4 border rounded ${errors.password ? 'border-red-500 mb-0' : ''}`}
                    {...register('password', {
                        required: 'Password field is required',
                        minLength: { value: 8, message: 'Password must be at least 8 characters long' },
                        pattern: {
                            value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$/,
                            message: 'Password must contain at least one letter, one number, and one special character',
                        },
                    })}

                />
                {errors.password && <p className="text-red-500 mb-1 h-13">{errors.password.message}</p>}
                <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type='submit'>
                    Login
                </button>
            </div>
        </form>
    );
};

export default LoginForm;