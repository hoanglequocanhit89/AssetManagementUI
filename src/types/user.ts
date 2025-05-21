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