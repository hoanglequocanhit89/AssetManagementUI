import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    token: string,
}

const initialState: AuthState = {
    token: '',
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (data) => {
            // Call api login and get token as response from server
            initialState.token = '' //Token
        },
        logout: () => {
            initialState.token = '';
        }
    }
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;