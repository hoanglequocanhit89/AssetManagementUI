export interface User {
    id: number;
    staffCode: string;
    fullName: string;
    userName: string;
    joinedDate: string;
    role: string;
}

export interface DetailUser extends User {
    dob: string;
    gender: string;
    type: string;
    location: string;
}