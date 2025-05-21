import { BaseParams, BaseResponse, BaseResponseWithoutPagination, CreateUserRequest, CreateUserResponse, User, UserFilterRequest } from "../types";
import axiosClients from "./axiosClients";

const userApi = {
    getUserList(adminId: number, userFilterRequest: UserFilterRequest, params: BaseParams): Promise<BaseResponse<User>> {
        const url = `users?adminId=${adminId}`

        const finalParams = Object.keys(userFilterRequest).length > 0
            ? { ...params, ...userFilterRequest }
            : params;

        return axiosClients.get(url, { params: finalParams })
    },

    createUser(body: CreateUserRequest): Promise<BaseResponseWithoutPagination<CreateUserResponse>> {
        return axiosClients.post("users", body);
    },

}

export default userApi;