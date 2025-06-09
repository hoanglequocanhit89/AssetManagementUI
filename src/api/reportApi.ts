import { BaseParams, BaseResponse, BaseResponseWithoutPagination, Report } from "../types";
import axiosClients from "./axiosClients";

const reportApi = {
    getReportList(): Promise<BaseResponseWithoutPagination<Report[]>> {
        const url = "reports/all"
        return axiosClients.get(url);
    },
    getReportListWithPagination(params: BaseParams): Promise<BaseResponse<Report>> {
        const url = "reports"
        return axiosClients.get(url, { params })
    }
}
export default reportApi;