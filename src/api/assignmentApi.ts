import axiosClients from "./axiosClients";
import { BaseResponse, BaseResponseWithoutPagination } from "../types";
import { Assignment, AssignmentDetail, CreateAssignmentResponse, CreateAssignmentRequest } from "../types/assignment";

interface AssignmentParams {
    status?: string;
    assignedDate?: string;
    query?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
}

const assignmentApi = {
  createAssignment(
    request: CreateAssignmentRequest
  ): Promise<CreateAssignmentResponse> {
    return axiosClients.post("assignments", request);
  },

  getAssignmentList(
    props: AssignmentParams
  ): Promise<BaseResponse<Assignment>> {
    const { status, assignedDate, query, page = 0, size = 20, sortBy = "assetCode", sortDir = "asc" } = props;

    const params = {
            status,
            assignedDate,
            query,
            page,
            size,
            sortBy,
            sortDir
        };

        (Object.keys(params) as (keyof typeof params)[]).forEach(
            (key) => params[key] === undefined && delete params[key]
        );

        const url = `assignments`;

    return axiosClients.get(url, { params: params });
  },

  getAssignmentDetail(
    assignmentId: number
  ): Promise<BaseResponseWithoutPagination<AssignmentDetail>> {
    const url = `assignments/${assignmentId}`;

    return axiosClients.get(url);
  },

  deleteAssignment(
    assignmentId: number
  ): Promise<BaseResponseWithoutPagination<string>> {
    const url = `assignments/${assignmentId}`;
    return axiosClients.delete(url);
  },
};

export default assignmentApi;