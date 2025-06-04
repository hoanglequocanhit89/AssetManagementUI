import { RequestReturning } from './../types/request-returning';
import { BaseResponse, BaseResponseWithoutPagination } from "../types";
import axiosClients from "./axiosClients";

interface RequestReturningParams {
    status?: string;
    returnedDate?: string;
    query?: string
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
}

const requestReturningApi = {
    getRequestReturningList(
        props: RequestReturningParams
    ): Promise<BaseResponse<RequestReturning>> {
        const {
            status,
            returnedDate,
            query,
            page = 0,
            size = 20,
            sortBy = "assetCode",
            sortDir = "asc",
        } = props;

        const params = {
            status,
            returnedDate,
            query,
            page,
            size,
            sortBy,
            sortDir
        };

        (Object.keys(params) as (keyof typeof params)[]).forEach(
            (key) => params[key] === undefined && delete params[key]
        );

        const url = `return`;

        return axiosClients.get(url, { params: params });
    },

    CompletedRequestReturning(
        id: number
    ): Promise<BaseResponseWithoutPagination<string>> {
        const url = `return/${id}/complete`;
        return axiosClients.patch(url);
    },

    CancelRequestReturningModal(
        returningRequestId: number
    ): Promise<BaseResponseWithoutPagination<string>> {
        const url = `return/${returningRequestId}`;
        return axiosClients.delete(url);
    }
}

export default requestReturningApi;