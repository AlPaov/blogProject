import { apiSlice } from "../../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentails => ({
                url: '/login',
                method: 'POST',
                body: { ...credentails }
            })
        })
    })
})

export const {
    useLoginMutation
} = authApiSlice