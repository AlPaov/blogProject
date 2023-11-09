import { configureStore, Dispatch, AnyAction } from '@reduxjs/toolkit';
import { useDispatch as useReduxDispatch } from 'react-redux';
import { createSlice, combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';
import authReducer from '../features/auth/authSlice';

interface AppState {
    posts: any[];
    postStatus: { [postId: number]: "like" | "dislike" | null };
    subscriptionStatus: { [postId: number]: true | false };
    homeTabState: number;
    postRatings: { [postId: number]: number };
    auth: {
        user: any | null;
        token: string | null;
    };
}

const initialState: AppState = {
    posts: [],
    postStatus: {},
    subscriptionStatus: {},
    homeTabState: 0,
    postRatings: {},
    auth: {
        user: null,
        token: null,
    },
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        setPostStatus: (state, action) => {
            state.postStatus = action.payload;
        },
        setSubscriptionStatus: (state, action) => {
            state.subscriptionStatus = action.payload;
        },
        setHomeTabState: (state, action) => {
            state.homeTabState = action.payload;
        },
        setPostRatings: (state, action) => {
            state.postRatings = action.payload;
        },
        clearUserData: (state) => {
            state.posts = [];
            state.postStatus = {};
            state.subscriptionStatus = {};
            state.postRatings = {};
        },
    },
});
const rootReducer = combineReducers({
    app: appSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;


export const {
    setPosts,
    setPostStatus,
    setSubscriptionStatus,
    setHomeTabState,
    setPostRatings,
    clearUserData,
} = appSlice.actions;


export const useAppDispatch = () => useReduxDispatch<Dispatch<AnyAction>>();