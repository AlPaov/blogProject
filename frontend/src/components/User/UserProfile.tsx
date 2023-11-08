import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '../../api/httpHook';
import Comments from '../Comment/CommentList';
import AllPostInfo, { Post } from '../Post/AllPostInfo';
import { useSelector } from 'react-redux';
import CreatePostButton from '../Post/createPostButton';
import CreatePostModal from '../Post/CreatePostModal';
import { Link } from 'react-router-dom';
import {
    RootState,
    setPostStatus,
    useAppDispatch,
} from '../../redux/store';
import { Comment } from '../types';
import { selectCurrentUser } from '../../features/auth/authSlice';

interface followList {
    id: number,
    username: string
}


const UserProfile: React.FC = () => {

    const { userId = '' } = useParams<{ userId?: string }>();

    const current_user_id = useSelector(
        selectCurrentUser
    );
    const [comments, setComments] = useState<Comment[]>([]);
    const [user_posts, setPosts] = useState<Post[]>([]);
    const [activeTab, setActiveTab] = useState('Posts');
    const [userData, setUserData] = useState({
        username: '',
        followers: 0,
        following: 0,
        joinDate: '',
        karma: 0,
    });

    const dispatch = useAppDispatch();
    const { request } = useHttp();

    const [followersModalOpen, setFollowersModalOpen] = useState(false);
    const [followingModalOpen, setFollowingModalOpen] = useState(false);
    const [createPostModal, setCreatePostModal] = useState(false);
    const [followersList, setFollowersList] = useState<followList[]>([]);
    const [followingList, setFollowingList] = useState<followList[]>([]);
    const [isSubscribed, setIsSubscribed] = useState<{ [key: number]: boolean }>({});
    const GlobalPosts = useSelector((state: RootState) => state.app.posts);
    useEffect(() => {
        fetchPostsAndComments();
        fetchSubscribeStatus();
        console.log(isSubscribed)
    }, [userId, current_user_id, dispatch, GlobalPosts]);

    const fetchPostsAndComments = async () => {
        try {
            const postsData = await request(
                `http://127.0.0.1:8000/user/${userId}/posts/?current_user_id=${current_user_id}`
            );
            const commentsData = await request(
                `http://127.0.0.1:8000/user/${userId}/comments/?current_user_id=${current_user_id}`
            );
            const userData = await request(`http://127.0.0.1:8000/user/${userId}/`);

            setUserData({
                username: userData.username,
                followers: userData.followers,
                following: userData.following,
                joinDate: userData.register_date,
                karma: userData.karma,
            });

            const initialPostStatus: { [postId: number]: "like" | "dislike" | undefined } = {};
            const initialSubscriptionStatus: { [postId: number]: true | false } = {};

            for (const post of postsData.posts) {
                initialPostStatus[post.id] = post.like_or_dis;
                initialSubscriptionStatus[post.id] = post.subscribed;
            }
            console.log(commentsData.comments)
            setComments(commentsData.comments);
            setPosts(postsData.posts);
            dispatch(setPostStatus(initialPostStatus));
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };
    const fetchSubscribeStatus = async () => {
        try {
            const followersData = await request(
                `http://127.0.0.1:8000/user/${userId}/followers`
            );
            const followingData = await request(
                `http://127.0.0.1:8000/user/${userId}/following`
            );
            const followingWithUsernames = await Promise.all(
                followingData.map(async (followingId: any) => {
                    const userData = await request(`http://127.0.0.1:8000/user/${followingId}`);
                    return { id: followingId, username: userData.username };
                })
            );
            const followersWithUsernames = await Promise.all(
                followersData.map(async (followerId: any) => {
                    const userData = await request(`http://127.0.0.1:8000/user/${followerId}`);
                    return { id: followerId, username: userData.username };
                })
            );
            const updatedIsSubscribedList: { [key: number]: boolean } = {};

            for (const following of followingWithUsernames) {
                const isCurrentUserSubscribed = await request(
                    `http://127.0.0.1:8000/user/${current_user_id}/check-if-subscribed?user_id=${current_user_id}&subscribtion_id=${following.id}`
                );

                updatedIsSubscribedList[following.id] = isCurrentUserSubscribed;
            }

            for (const follower of followersWithUsernames) {
                const isCurrentUserSubscribed = await request(
                    `http://127.0.0.1:8000/user/${current_user_id}/check-if-subscribed?user_id=${current_user_id}&subscribtion_id=${follower.id}`
                );

                updatedIsSubscribedList[follower.id] = isCurrentUserSubscribed;
            }
            const isCurrentUserSubscribedOnUser = await request(
                `http://127.0.0.1:8000/user/${current_user_id}/check-if-subscribed?user_id=${current_user_id}&subscribtion_id=${userId}`
            );
            updatedIsSubscribedList[+userId] = isCurrentUserSubscribedOnUser;

            setFollowingList(followingWithUsernames);
            setFollowersList(followersWithUsernames);
            setIsSubscribed(updatedIsSubscribedList);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };
    const onDeleteComment = async (commentId: number) => {
        try {
            await request(`http://127.0.0.1:8000/p/${userId}/${commentId}/delete`, 'DELETE');
            setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
        } catch (error) {
            console.error('Error while deleting comment:', error);
        }
    };

    const openFollowersModal = async () => {
        setFollowersModalOpen(true);
    };

    const openFollowingModal = async () => {
        setFollowingModalOpen(true);
    };

    const closeFollowersModal = () => {
        setFollowersModalOpen(false);
    };

    const closeFollowingModal = () => {
        setFollowingModalOpen(false);
    };
    const openCreatePostModal = () => {
        setCreatePostModal(true)
    }
    const closeCreatePostModal = () => {
        setCreatePostModal(false)
    }
    const handleSubscription = async (followerId: number) => {
        try {
            const response = await request(`http://127.0.0.1:8000/home/${current_user_id}/subscribe/`, 'POST', JSON.stringify({
                user_id: current_user_id,
                follow_id: followerId,
            }));


            if (response) {
                const updatedIsSubscribedList = { ...isSubscribed };
                updatedIsSubscribedList[followerId] = !isSubscribed[followerId];
                setIsSubscribed(updatedIsSubscribedList);
            } else {
                console.error('Subscription request failed:', response.error);
            }

            if (followerId == +userId) {
                const updatedFollowersCount = userData.followers + (isSubscribed[followerId] ? -1 : 1);
                setUserData((prevUserData) => ({
                    ...prevUserData,
                    followers: updatedFollowersCount,
                }));
            }
            if (current_user_id == +userId) {
                const updatedFolloweingCount = userData.following + (isSubscribed[followerId] ? -1 : 1);
                setUserData((prevUserData) => ({
                    ...prevUserData,
                    following: updatedFolloweingCount,
                }));
            }

        } catch (error) {
            console.error('Error while subscribing/unsubscribing:', error);
        }
    };
    return (
        <div>
            <div className="flex mb-5 justify-center w-full shadow-md">
                <div className="flex w-full max-w-[1270px]">
                    <button
                        className={`${activeTab === 'Posts'
                            ? 'border-b-2 border-blue-500  text-blue-500'
                            : 'border-b-2 border-transparent hover:text-blue-500'
                            } py-2 px-4 rounded-t text-lg`}
                        onClick={() => setActiveTab('Posts')}
                    >
                        Posts
                    </button>
                    <button
                        className={`${activeTab === 'Comments'
                            ? 'border-b-2 border-blue-500 text-blue-500'
                            : 'border-b-2 border-transparent hover:text-blue-500'
                            } py-2 px-4 rounded-b text-lg`}
                        onClick={() => setActiveTab('Comments')}
                    >
                        Comments
                    </button>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="p-4 max-w-[1000px] w-full">

                    {activeTab === 'Posts' && (
                        <>
                            <h1 className="text-2xl font-semibold mb-4">Posts</h1>
                            <AllPostInfo
                                posts={user_posts}
                                homeTabState={0}
                                showLikeButtons={true}
                                showSubscribeButton={false}
                                disableCommentsLink={false}
                            />
                        </>
                    )}

                    {activeTab === 'Comments' && (
                        <>
                            <h1 className="text-2xl font-semibold mb-4">Comments</h1>
                            <Comments comments={comments} onDeleteComment={onDeleteComment} clickableComment={true} />
                        </>
                    )}
                </div>

                <div className="p-4 max-w-[300px] w-full flex-none">

                    <div className="bg-gray-100 p-4 rounded shadow-md">
                        <h1 className="text-2xl font-semibold mb-2 text-center">
                            {userData.username}
                        </h1>
                        <div className="flex justify-center mb-2">
                            <div
                                className="cursor-pointer flex flex-col items-center mr-6"
                                onClick={openFollowersModal}
                            >
                                <span className="text-gray-600">Followers</span>
                                <span className="text-lg font-semibold">{userData.followers}</span>
                            </div>

                            <div
                                className="cursor-pointer flex flex-col items-center"
                                onClick={openFollowingModal}
                            >
                                <span className="text-gray-600">Following</span>
                                <span className="text-lg font-semibold">{userData.following}</span>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="flex flex-col items-center mr-6">
                                <span className="text-gray-600">Karma</span>
                                <span className="text-lg font-semibold">{userData.karma}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-gray-600">Join Date</span>
                                <span className="text-lg font-semibold">
                                    {new Date(userData.joinDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-center mt-4">
                            {userId && current_user_id !== +userId ? (
                                <button className={`text-white py-2 px-4 rounded ${isSubscribed[+userId]
                                    ? 'bg-blue-300'
                                    : 'bg-blue-500'
                                    }`}
                                    onClick={() => handleSubscription(+userId)}
                                >
                                    {isSubscribed[+userId] ? 'Подписан' : 'Подписаться'}
                                </button>
                            ) : (
                                <Link
                                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                                    to={`/user/${current_user_id}/settings`}>Settings</Link>
                            )}
                        </div>

                    </div>
                    {+userId == current_user_id &&
                        <div className="flex justify-center mt-4">

                            <CreatePostButton
                                onClick={openCreatePostModal}
                            />
                            {createPostModal && <CreatePostModal
                                userId={current_user_id}
                                onClose={closeCreatePostModal}
                            />
                            }
                        </div>
                    }
                </div>
            </div>
            {/* Follower Modal */}
            {
                followersModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        {/* Modal content */}
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">Followers</h2>
                            <ul>
                                {followersList.map((follower, index) => (
                                    <li className='flex justify-between my-2' key={index}>{follower.username}
                                        <button
                                            className={`ml-2 text-white px-2 rounded border border-transparent hover:border-black
                    hover:bg-blue-300 transition-colors ${isSubscribed[follower.id]
                                                    ? 'bg-blue-300'
                                                    : 'bg-blue-500'
                                                }`}
                                            onClick={() => handleSubscription(follower.id)}
                                        >
                                            {isSubscribed[follower.id] ? 'Unfollow' : 'Follow'}
                                        </button>
                                    </li>

                                ))}
                            </ul>
                            <div className="flex justify-center mt-4">
                                <button onClick={closeFollowersModal} className="bg-blue-500 text-white py-2 px-4 rounded">
                                    Close
                                </button>


                            </div>
                        </div>
                    </div>
                )
            }
            {
                followingModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        {/* Modal content */}
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">Following</h2>
                            <ul>
                                {followingList.map((followed, index) => (
                                    <li className='flex justify-between my-2' key={index}>{followed.username}
                                        <button
                                            className={`ml-2 text-white px-2 rounded border border-transparent hover:border-black
                    hover:bg-blue-300 transition-colors ${isSubscribed[followed.id]
                                                    ? 'bg-blue-300'
                                                    : 'bg-blue-500'
                                                }`}
                                            onClick={() => handleSubscription(followed.id)}
                                        >
                                            {isSubscribed[followed.id] ? 'Unfollow' : 'Follow'}
                                        </button></li>
                                ))}
                            </ul>
                            <div className="flex justify-center mt-4">
                                <button onClick={closeFollowingModal} className="bg-blue-500 text-white py-2 px-4 rounded">
                                    Close
                                </button>


                            </div>
                        </div>
                    </div>
                )
            }

        </div >
    );
};

export default UserProfile;