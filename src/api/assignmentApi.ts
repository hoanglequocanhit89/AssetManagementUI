import { BaseParams, BaseResponse, BaseResponseWithoutPagination } from "../types";
import { Assignment, AssignmentDetail } from "../types/assignment";
import axiosClients from "./axiosClients";

interface AssignmentParams {
    locationId: number;
    keyword: string;
    states: string;
    params: BaseParams
}

const assignmentApi = {

    getAssignmentList(props: AssignmentParams): Promise<BaseResponse<Assignment>> {

        const { locationId, keyword, states, params } = props;

        const url = `assets?locationId=${locationId}&keyword=${keyword}&states=${states}`;

        return axiosClients.get(url, { params: params });
    },

    getAssignmentDetail(assignmentId: number): Promise<BaseResponseWithoutPagination<AssignmentDetail>> {

        const url = `assignments/${assignmentId}`;

        return axiosClients.get(url);
    },

    deleteAssignment(assignmentId: number): Promise<BaseResponseWithoutPagination<string>> {
        const url = `assignments/${assignmentId}`;
        return axiosClients.delete(url);
    }
}



export default assignmentApi;