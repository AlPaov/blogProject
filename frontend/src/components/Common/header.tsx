import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentToken, selectCurrentUser } from '../../features/auth/authSlice';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { logOut } from '../../features/auth/authSlice';

const Header = () => {
    const current_user_id = useSelector(selectCurrentUser);
    const current_token = useSelector(selectCurrentToken);
    const dispatch = useDispatch();

    const logoutHandler = async () => {
        Cookies.remove('auth_token')
        dispatch(logOut())
    }

    return (
        <header>
            <nav className=' h-20 px-20 bg-blue-500'>
                <ul className='flex  justify-between'>
                    <li className='text-white font-medium text-3xl hover:text-gray-200 m-4'>
                        <Link to="/" className=' text-center '>Home</Link>
                    </li>

                    {current_token && (
                        <li className='text-white font-medium text-3xl hover:text-gray-200 m-4'>
                            <Link to={`/user/${current_user_id}/`}>My profile</Link>
                        </li>
                    )}

                    {current_token && (
                        <li className='text-white font-medium text-3xl hover:text-gray-200 m-4'>
                            <Link onClick={() => logoutHandler()} to={`/home`}>Logout</Link>
                        </li>
                    )}

                    {!current_token && (
                        <li className='text-white font-medium text-3xl hover:text-gray-200 m-4'>
                            <Link to={`/register`}>Register</Link>
                        </li>
                    )}
                    {!current_token && (
                        <li className='text-white font-medium text-3xl hover:text-gray-200 m-4'>
                            <Link to={`/login`}>Login</Link>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;