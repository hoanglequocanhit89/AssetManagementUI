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
    email: string;
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
    email: string;
}

export interface CreateUserResponse {
    id: number;
    staffCode: string;
    username: string;
    joinedDate: Date;
    location: string;
    role: string;
    fullName: string;
    dob: Date;
    gender: string;
    email:string;
    isSentEmail: boolean;
}

export type UserDetailResponse = Omit<DetailUser, "id" | "canDisable" | "type">

export interface UpdateUserRequest {
    dob: string;
    gender: "MALE" | "FEMALE";
    joinedDate: string;
    role: "STAFF" | "ADMIN";
}

export type UserBrief = {
  id: number;
  staffCode: string;
  fullName: string;
  firstName: string;
  role: string;
}

export type getAllUsersParams = {
  sortBy?: keyof UserBrief;
  sortDir?: "asc" | "desc";
  query?: string | null;
}