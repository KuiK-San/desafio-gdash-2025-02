import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { apiSlice } from './api'
import type { User } from './types/users'

interface AuthState {
    user: User | null
    isAuthenticated: boolean
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload
            state.isAuthenticated = !!action.payload
        },
        clearAuth: (state) => {
            state.user = null
            state.isAuthenticated = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                apiSlice.endpoints.login.matchFulfilled,
                (state, action) => {
                    state.user = action.payload.user
                    state.isAuthenticated = true
                }
            )
            .addMatcher(
                apiSlice.endpoints.getMe.matchFulfilled,
                (state, action) => {
                    state.user = action.payload
                    state.isAuthenticated = true
                }
            )
            .addMatcher(
                apiSlice.endpoints.getMe.matchRejected,
                (state) => {
                    state.user = null
                    state.isAuthenticated = false
                }
            )
            .addMatcher(
                apiSlice.endpoints.logout.matchFulfilled,
                (state) => {
                    state.user = null
                    state.isAuthenticated = false
                }
            )
    },
})

export const { setUser, clearAuth } = authSlice.actions
export default authSlice.reducer
