import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../features/auth/authSlice'
import { RootState } from '../redux/store'
const baseQuery = fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})


export const apiSlice = createApi({
    baseQuery: baseQuery,
    endpoints: builder => ({})
})
