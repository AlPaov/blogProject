import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';
import PostPage from './pages/PostPage';
import UserSettingsPage from './pages/UserSettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RequireAuth from './features/auth/RequireAuth';
import Layout from './components/Common/Layout';
import { setCredentials } from './features/auth/authSlice';
import { useDispatch } from 'react-redux';

interface DecodedToken {
  exp: number
  user_id: string;

}

const App: React.FC = () => {

  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const auth_token = Cookies.get('auth_token')
    if (auth_token) {

      const token_data = jwtDecode(auth_token) as DecodedToken

      console.log(token_data.exp * 1000 - Date.now())
      if (token_data.exp != null && token_data.exp * 1000 <= Date.now()) {
        Cookies.remove('auth_token')
      } else {
        dispatch(setCredentials({ user: token_data.user_id, accessToken: auth_token }))
        setInitialized(true);
      }
    } else {
      setInitialized(true);
    }
  }, [dispatch])

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        <Route index element={<HomePage />}></Route>
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />



        <Route element={<RequireAuth />}>
          <Route path="/p/:postId" element={<PostPage />} />
          <Route path="/user/:userId" element={<UserProfilePage />} />
          <Route path="/user/:userId/settings" element={<UserSettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;