import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: 0, token: null },
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken } = action.payload
            state.user = user
            state.token = accessToken
        },
        logOut: (state) => {
            state.user = 0
            state.token = null
        }
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state: RootState) => state.auth.user
export const selectCurrentToken = (state: RootState) => state.auth.token