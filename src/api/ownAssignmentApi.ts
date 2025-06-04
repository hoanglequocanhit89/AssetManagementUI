import { BaseResponseWithoutPagination } from "../types";
import { OwnAssignment, OwnAssignmentDetail } from "../types/assignment";
import axiosClients from "./axiosClients";

const assignmentApi = {
  async getOwnAssignmentList(params?: {
    sortBy: string;
    orderBy: string;
  }): Promise<BaseResponseWithoutPagination<OwnAssignment[]>> {
    if (params) {
      let searchParams = new URLSearchParams();
      searchParams.set("sortBy", params.sortBy);
      searchParams.set("sortDir", params.orderBy);
      return await axiosClients.get("assignments/me", {
        params: searchParams,
      });
    }
    return await axiosClients.get("assignments/me");
  },

  async getOwnAssignmentDetail(
    assignmentId: number
  ): Promise<BaseResponseWithoutPagination<OwnAssignmentDetail>> {
    return axiosClients.get(`assignments/${assignmentId}`);
  },

  async responseOwnAssignment(assignmentId: number, status: string): Promise<void> {
    return await axiosClients.patch(`assignments/${assignmentId}?status=${status}`);
  },

  async returnOwnAssignment(assignmentId: number): Promise<void> {
    if (!assignmentId || assignmentId <= 0) {
      throw new Error("Invalid assignmentId for return request");
    }
    await axiosClients.post(`return/me`, {
      assignmentId: assignmentId
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  },
};

export default assignmentApi;
