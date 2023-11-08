import React, { useEffect } from 'react';
import AllPostInfo from '../Post/AllPostInfo';
import { useHttp } from '../../api/httpHook';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, clearUserData, setPostStatus, setSubscriptionStatus, setPosts, setHomeTabState } from '../../redux/store';
import { selectCurrentToken, selectCurrentUser } from '../../features/auth/authSlice';


const Home: React.FC = () => {
    const current_user_id = useSelector(selectCurrentUser)
    const current_token = useSelector(selectCurrentToken)
    const posts = useSelector((state: RootState) => state.app.posts);
    const homeTabState = useSelector((state: RootState) => state.app.homeTabState);

    const dispatch = useDispatch();

    const { request } = useHttp();


    useEffect(() => {

        dispatch(clearUserData());
        getPosts(homeTabState);

    }, [current_user_id, homeTabState]);

    const getPosts = async (subs: number) => {
        try {

            const data = await request(`http://127.0.0.1:8000/home/${current_user_id + '?' + 'subs=' + subs}`);
            console.log(data)

            if (data && Array.isArray(data.posts)) {

                const initialPostStatus: { [postId: number]: "like" | "dislike" | undefined } = {};
                const initialSubscriptionStatus: { [postId: number]: true | false } = {}
                for (const post of data.posts) {
                    initialPostStatus[post.id] = post.like_or_dis;
                    initialSubscriptionStatus[post.id] = post.subscribed
                }
                dispatch(setPosts(data.posts));
                dispatch(setPostStatus(initialPostStatus));
                dispatch(setSubscriptionStatus(initialSubscriptionStatus));
            } else {
                console.error('Ошибка при получении постов: Неверный формат данных');
            }
        } catch (error) {
            console.error('Ошибка при получении постов:', error);
        }
    };


    return (
        <div className='container mx-auto max-w-[900px] w-full'>
            {current_token && (
                <div className="flex justify-between py-4">

                    <button className="flex justify-center text-2xl font-bold mb-4 hover:underline"
                        onClick={() => dispatch(setHomeTabState(0))}
                    >All posts</button>

                    <button className="flex justify-center text-2xl font-bold mb-4 hover:underline"
                        onClick={() => dispatch(setHomeTabState(1))}
                    >Followed</button>
                </div>
            )}
            {!current_token && (
                <div className="flex justify-between py-4">

                    <button className="flex justify-center text-2xl font-bold mb-4"
                    >All posts</button>
                </div>
            )}

            <AllPostInfo posts={posts}
                homeTabState={homeTabState}
                showLikeButtons={true}
                showSubscribeButton={true}
                disableCommentsLink={false} />
        </div >
    );
};

export default Home;