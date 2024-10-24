import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    currentUser: null,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },

        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateStart: (state, action) => {
            state.loading = true;
            state.error = null
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = false;
            state.error = null;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signoutSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
    },
});

export const { signInStart, signInSuccess, signInFailure, updateStart, updateFailure, updateSuccess, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutSuccess } = userSlice.actions;

export default userSlice.reducer;
