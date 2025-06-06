import { BaseParams, BaseResponse, BaseResponseWithoutPagination, CreateUserRequest, CreateUserResponse, getAllUsersParams, UpdateUserRequest, User, UserBrief, UserDetailResponse, UserFilterRequest } from "../types";
import axiosClients from "./axiosClients";

const userApi = {
  getUserList(
    adminId: number,
    userFilterRequest: UserFilterRequest,
    params: BaseParams
  ): Promise<BaseResponse<User>> {
    const url = `users?adminId=${adminId}`;

    const finalParams = Object.fromEntries(
      Object.entries({ ...params, ...userFilterRequest }).filter(
        ([_, v]) => v !== ""
      )
    );

    return axiosClients.get(url, { params: finalParams });
  },

  createUser(
    body: CreateUserRequest
  ): Promise<BaseResponseWithoutPagination<CreateUserResponse>> {
    return axiosClients.post("users", body);
  },

  getDetailUser(
    userId: number
  ): Promise<BaseResponseWithoutPagination<UserDetailResponse>> {
    const url = `users/${userId}`;
    return axiosClients.get(url);
  },

  updateUser(
    userId: number,
    data: UpdateUserRequest
  ): Promise<BaseResponseWithoutPagination<null>> {
    return axiosClients.put(`users/${userId}`, data);
  },

  disableUser(userId: number): Promise<BaseResponseWithoutPagination<null>> {
    const url = `users/${userId}`;
    return axiosClients.delete(url);
  },

  getAllUsers(
    params: getAllUsersParams
  ): Promise<BaseResponseWithoutPagination<UserBrief[]>> {
    const url = `users/all/brief`;
    return axiosClients.get(url, { params });
  },
};

export default userApi;