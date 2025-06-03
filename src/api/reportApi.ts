import { BaseResponseWithoutPagination, Report } from "../types";
import axiosClients from "./axiosClients";

const reportApi = {
    getReportList(): Promise<BaseResponseWithoutPagination<Report[]>> {
        const url = "reports"
        return axiosClients.get(url);
    }
}
export default reportApi;