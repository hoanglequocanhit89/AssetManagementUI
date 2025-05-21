import { BaseParams, BaseResponse, BaseResponseWithoutPagination, CreateUserRequest, CreateUserResponse, UpdateUserRequest, User, UserDetailResponse, UserFilterRequest } from "../types";
import axiosClients from "./axiosClients";

const userApi = {
    getUserList(adminId: number, userFilterRequest: UserFilterRequest, params: BaseParams): Promise<BaseResponse<User>> {
        const url = `users?adminId=${adminId}`

        const finalParams = Object.fromEntries(
            Object.entries({ ...params, ...userFilterRequest }).filter(([_, v]) => v !== "")
        );

        return axiosClients.get(url, { params: finalParams })
    },

    createUser(body: CreateUserRequest): Promise<BaseResponseWithoutPagination<CreateUserResponse>> {
        return axiosClients.post("users", body);
    },

    getDetailUser(userId: number): Promise<BaseResponseWithoutPagination<UserDetailResponse>> {
        const url = `/users/${userId}`
        return axiosClients.get(url)
    },

    updateUser(userId: number, data: UpdateUserRequest): Promise<BaseResponseWithoutPagination<null>> {
        return axiosClients.put(`users/${userId}`, data);
    }

}

export default userApi;