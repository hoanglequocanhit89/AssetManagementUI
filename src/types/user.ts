export interface User {
    id: number;
    staffCode: string;
    fullName: string;
    username: string;
    joinedDate: string;
    role: string;
    canDisable: boolean;
}

export interface DetailUser extends User {
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    type: string;
    location: string;
}

export interface UserFilterRequest {
    query: string;
    type: string;
}

export interface CreateUserRequest {
    adminId?: number;
    firstName: string;
    lastName: string;
    gender: "MALE" | "FEMALE";
    dob: string;
    joinedDate: string;
    type: "STAFF" | "ADMIN";
    location?: "HCM" | "DN" | "HN";
}

export interface CreateUserResponse {
    staffCode: string;
    username: string;
    joinedDate: Date;
    location: string;
    role: string;
    fullName: string;
    dob: Date;
    gender: string
}

export type UserDetailResponse = Omit<DetailUser, "id" | "canDisable" | "type">

export interface UpdateUserRequest {
    dob: string;
    gender: "MALE" | "FEMALE";
    joinedDate: string;
    role: "STAFF" | "ADMIN";
}