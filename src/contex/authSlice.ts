import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');

const initialState = {
    isAuth: !!token,
    token: token || null,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuth = true;
            state.token = action.payload.token;
            state.user = action.payload.admin;
            localStorage.setItem('token', action.payload.token);
        },
        logout: (state) => {
            state.isAuth = false;
            state.token = null;
            state.user = null;
            localStorage.removeItem('token');
        },
    },
})


export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
