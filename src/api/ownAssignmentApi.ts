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

  async acceptOwnAssignment(assignmentId: number): Promise<void> {
    // const response = await axiosClients.post(`users/assignments/${assignmentId}/accept`);
    // return response.data;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  },

  async declineOwnAssignment(assignmentId: number): Promise<void> {
    // const response = await axiosClients.post(`users/assignments/${assignmentId}/decline`);
    // return response.data;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  },

  async returnOwnAssignment(assignmentId: number): Promise<void> {
    // const response = await axiosClients.post(`users/assignments/${assignmentId}/return`);
    // return response.data;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  },
};

export default assignmentApi;
