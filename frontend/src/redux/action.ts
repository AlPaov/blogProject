export const setPosts = (posts: any[]) => ({
    type: 'SET_POSTS',
    payload: posts,
});

export const setPostStatus = (status: { [postId: number]: "like" | "dislike" | undefined }) => ({
    type: 'SET_POST_STATUS',
    payload: status,
});

export const setSubscriptionStatus = (status: { [postId: number]: true | false }) => ({
    type: 'SET_SUBSCRIPTION_STATUS',
    payload: status,
});

export const setHomeTabState = (state: number) => ({
    type: 'SET_HOME_TAB_STATE',
    payload: state,
});

export const setPostRatings = (status: { [postId: number]: number }) => ({
    type: 'SET_POST_RATINGS',
    payload: status,
});