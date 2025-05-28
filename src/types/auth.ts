export type UserRole = 'ADMIN' | 'STAFF' | null;

export interface LoginReponseDTO {
    role: UserRole,
    isFirstLogin: boolean
}

export interface LoginDataProps {
    username: string,
    password: string
}

export interface ChangePasswordProps {
    oldPassword?: string,
    newPassword: string
}