import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRole } from "../../types";

interface AuthState {
    role: UserRole,
    username: string | null,
    isFirstLogin: boolean | null,
}

const initialState: AuthState = {
    role: null,
    username: null,
    isFirstLogin: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<AuthState>) => {
            state.role = action.payload.role;
            state.username = action.payload.username;
            state.isFirstLogin = action.payload.isFirstLogin;
        },
        changePassword: (state) => {
            state.isFirstLogin = false;
        },
        logout: (state) => {
            state.role = null;
            state.username = null;
            state.isFirstLogin = null
        }
    }
});

export const { login, logout, changePassword } = authSlice.actions;

export default authSlice.reducer;