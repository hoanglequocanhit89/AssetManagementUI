import { ChangePasswordProps, LoginDataProps } from './../types/auth';
import { BaseResponseWithoutPagination, LoginReponseDTO } from "../types";
import axiosClients from "./axiosClients";

const authApi = {

    loginAction(data: LoginDataProps): Promise<BaseResponseWithoutPagination<LoginReponseDTO>> {
        const url = `auth/login`;
        return axiosClients.post(url, data);
    },
    changePasswordAction(data: ChangePasswordProps): Promise<BaseResponseWithoutPagination<string>> {
        const url = `auth/change-password`;
        return axiosClients.put(url, data);
    },
    changeFirstPasswordAction(data: ChangePasswordProps): Promise<BaseResponseWithoutPagination<string>> {
        const url = `auth/first-login-change-password`;
        return axiosClients.post(url, data);
    },
    logoutAction(): Promise<BaseResponseWithoutPagination<string>> {
        const url = `auth/logout`;
        return axiosClients.post(url);
    },
}

export default authApi;