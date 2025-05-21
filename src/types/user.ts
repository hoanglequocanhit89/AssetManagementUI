export interface User {
    id: number;
    staffCode: string;
    fullName: string;
    userName: string;
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
    firstName: string;
    lastName: string;
    gender: "MALE" | "FEMALE";
    dob: string;
    joinedDate: string;
    type: "STAFF" | "ADMIN"
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