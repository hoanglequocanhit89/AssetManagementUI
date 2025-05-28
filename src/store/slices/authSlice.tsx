import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Login from "../../pages/auth/login";
import { UserRole } from "../../types";

interface AuthState {
    role: UserRole,
    isFirstLogin: boolean | null,
}

const initialState: AuthState = {
    role: null,
    isFirstLogin: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<AuthState>) => {
            state.role = action.payload.role;
            state.isFirstLogin = action.payload.isFirstLogin;
        },
        changePassword: (state) => {
            state.isFirstLogin = false;
        },
        logout: (state) => {
            state.role = null;
            state.isFirstLogin = null
        }
    }
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;