import { ChangePasswordProps, LoginDataProps } from "./../types/auth";
import { BaseResponseWithoutPagination, LoginReponseDTO } from "../types";
import axiosClients from "./axiosClients";

const authApi = {
  loginAction(data: LoginDataProps): Promise<BaseResponseWithoutPagination<LoginReponseDTO>> {
    const url = `auth/login`;
    return axiosClients
      .post(url, data)
      .then((response) => response)
      .catch((err) => err.response.data);
  },
  changePasswordAction(data: ChangePasswordProps): Promise<BaseResponseWithoutPagination<string>> {
    const url = `auth/change-password`;
    return axiosClients
      .patch(url, data)
      .then((response) => response)
      .catch((err) => err);
  },
  logoutAction(): Promise<BaseResponseWithoutPagination<string>> {
    const url = `auth/logout`;
    return axiosClients
      .post(url)
      .then((response) => response)
      .catch((err) => err.response.data);
  },
};

export default authApi;
