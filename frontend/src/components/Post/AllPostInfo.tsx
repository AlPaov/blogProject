import { useState, useEffect } from 'react';
import { useHttp } from '../../api/httpHook';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setPostStatus, setSubscriptionStatus, setPostRatings, setPosts } from '../../redux/store';
import EditPostModal from './EditPostModal';
import { selectCurrentUser, selectCurrentToken } from '../../features/auth/authSlice';

export interface Post {
    id: number;
    title: string;
    creator_username: string | null;
    create_date: string;
    subscribed: boolean;
    creator_id: number | null;
    description: string;
    like_or_dis: 'like' | 'dislike' | null;
    comments_count: number | null;
    grade: number | null;

}

interface AllPostInfoComponentProps {
    posts: Post[];
    homeTabState: number | null;
    showLikeButtons: boolean;
    showSubscribeButton: boolean;
    disableCommentsLink: boolean;
}
const AllPostInfo: React.FC<AllPostInfoComponentProps> = ({ posts, homeTabState, showLikeButtons, disableCommentsLink, showSubscribeButton }) => {
    const current_user_id = useSelector(selectCurrentUser)
    const postRatings = useSelector((state: RootState) => state.app.postRatings);
    const postStatus = useSelector((state: RootState) => state.app.postStatus);
    const subscriptionStatus = useSelector((state: RootState) => state.app.subscriptionStatus);
    const GlobalPosts = useSelector((state: RootState) => state.app.posts);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const token = useSelector(selectCurrentToken)
    const [postToEdit, setPostToEdit] = useState({
        id: 0,
        title: 'Example Title',
        description: 'Example Description',
    });

    const dispatch = useDispatch();

    const { request } = useHttp();
    useEffect(() => {
        console.log(current_user_id)
        console.log(token)
    }, [current_user_id, GlobalPosts]);

    const handleLikeOrDislike = async (
        postId: number,
        actionType: 'like' | 'dislike',
    ) => {
        try {

            await request(`http://127.0.0.1:8000/home/${current_user_id}/rate/`, 'POST', JSON.stringify({
                user_id: current_user_id,
                post_id: postId,
                type: actionType,
            }));


            const updatedData = await request(`http://127.0.0.1:8000/home/${current_user_id + '?' + 'subs=' + homeTabState}`);

            const updatedPostStatus = {
                ...postStatus,
                [postId]: postStatus[postId] === actionType ? undefined : actionType,
            };

            dispatch(setPostStatus(updatedPostStatus));

            const updatedRatings = {
                ...postRatings,
                [postId]: updatedData.posts.find((post: Post) => post.id === postId)?.grade || 0,
            };

            dispatch(setPostRatings(updatedRatings));
        } catch (error) {
            console.error(`Error while ${actionType === 'like' ? 'liking' : 'disliking'} the post:`, error);
        }
    };

    const handleSubscribeOrUnsub = async (subscribe_id: number | null, actionType: true | false) => {
        try {
            if (subscribe_id || actionType != null) {
                await request(`http://127.0.0.1:8000/home/${current_user_id}/subscribe/`, 'POST', JSON.stringify({
                    user_id: current_user_id,
                    follow_id: subscribe_id,
                }));

                const updatedPosts = posts.map((post: Post) => {
                    if (post.creator_id === subscribe_id) {
                        return { ...post, subscribed: !actionType };
                    } else {
                        return post;
                    }
                });
                dispatch(setPosts(updatedPosts))

                const newSubscriptionStatus: { [postId: number]: true | false } = {};


                for (const post of posts) {
                    newSubscriptionStatus[post.id] = post.creator_id === subscribe_id ? !actionType : subscriptionStatus[post.id];
                }
                dispatch(setSubscriptionStatus(newSubscriptionStatus));

            } else {
                return false;
            }
        } catch (error) {
            console.error('Error while subscribing:', error);
        }
    };

    const onDeletePost = async (postId: number) => {
        try {
            await request(`http://127.0.0.1:8000/user/${current_user_id}/p/${postId}`, 'DELETE');
            const updatedPosts = GlobalPosts.filter((post) => post.id !== postId);
            dispatch(setPosts(updatedPosts));
            console.log(updatedPosts)
        } catch (error) {
            console.error('Error while deleting post:', error);
        }
    };

    const openEditModal = () => {
        setIsEditModalOpen(true);
    };

    const setCurrentPostEditing = (id: number, title: string, description: string) => {
        setPostToEdit({
            id,
            title,
            description,
        });
    };
    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    return (
        <div className="space-y-6 items-center flex flex-col">
            {posts.map((post: Post) => (
                <div key={post.id} className="rounded items-center mb-2 w-full">
                    <div className="flex items-center justify-between mb-1">
                        <div>
                            {post.creator_id ? (
                                <Link to={`/user/${post.creator_id}`} className="text-sm text-gray mr-5">
                                    {post.creator_username}
                                </Link>
                            ) : (
                                <span className="text-sm text-gray mr-5">Deleted user</span>
                            )}
                            <span className="text-sm text-gray-500">
                                {new Date(post.create_date).toLocaleString()}
                            </span>
                        </div>
                        {showSubscribeButton && current_user_id != post.creator_id && (
                            <div>
                                <button
                                    className={`text-white px-2 rounded border border-transparent hover:border-black
                    hover:bg-blue-300 transition-colors ${subscriptionStatus[post.id]
                                            ? 'bg-blue-300'
                                            : 'bg-blue-500'
                                        }`}
                                    onClick={() => handleSubscribeOrUnsub(post.creator_id, post.subscribed)}
                                >
                                    {subscriptionStatus[post.id] ? 'Subscribed' : 'Subscribe'}
                                </button>
                            </div>
                        )}
                        {current_user_id == post.creator_id && (
                            <div>
                                <button onClick={() => { setCurrentPostEditing(post.id, post.title, post.description); openEditModal(); }}
                                    className={`text-white px-2 rounded border border-transparent hover:border-black
                    hover:bg-orange-300 transition-colors bg-orange-400 mr-1`}

                                >
                                    Edit
                                </button>
                                {isEditModalOpen && (
                                    <EditPostModal
                                        post={postToEdit}
                                        onClose={closeEditModal}
                                        userId={current_user_id}
                                        postId={postToEdit.id}
                                    />
                                )}
                                <button
                                    className={`text-white px-2 rounded border border-transparent hover:border-black
                    hover:bg-red-300 transition-colors bg-red-500`}
                                    onClick={() => onDeletePost(post.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                    <div className='border'>
                        <h2 className="text-xl font-semibold p-3">{post.title}</h2>
                        <hr />
                        <p className="p-3">{post.description}</p>
                    </div>
                    <div className="flex justify-between mt-1">
                        <div className='flex justify-between max-h-9 max-w-[230px] w-full'>
                            {showLikeButtons && (
                                <div className='flex justify-between w-full'>
                                    <button
                                        className={`text-white px-2 py-1 rounded hover:bg-blue-300 transition-colors 
                            border border border-transparent hover:border-black
                ${postStatus[post.id] === "like"
                                                ? 'bg-blue-300' : 'bg-blue-500'}`}
                                        onClick={() => handleLikeOrDislike(post.id, "like")}
                                    >
                                        Like
                                    </button>
                                    <button
                                        className={`text-white px-2 py-1 ml-1 mr-1 rounded hover:bg-red-300 transition-colors border
                            border border border-transparent hover:border-black
                ${postStatus[post.id] === "dislike"
                                                ? 'bg-red-300' : 'bg-red-500'}`}
                                        onClick={() => handleLikeOrDislike(post.id, "dislike")}
                                    >
                                        Dislike
                                    </button>

                                </div>
                            )}
                            <span className='py-1 max-w-100 w-full'> Rating: {postRatings[post.id] ?? post.grade}</span>
                        </div>




                        {disableCommentsLink ? (
                            <span className="mt-1  text-gray-500">Comments: {post.comments_count}</span>
                        ) : (
                            <Link to={`/p/${post.id}/`} className="mt-1 text-gray-500 hover:underline">
                                Comments: {post.comments_count}
                            </Link>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AllPostInfo;