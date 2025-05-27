import { BaseResponseWithoutPagination } from "../types";
import { Assignment, AssignmentDetail } from "../types/assignment";

const assignmentApi = {
  async getOwnAssignmentList(params?: {
    sortBy: string;
    orderBy: string;
  }): Promise<BaseResponseWithoutPagination<Assignment[]>> {
    // let searchParams = new URLSearchParams();
    // if(params) {
    //   searchParams.set("sortBy", params.sortBy);
    //   searchParams.set("orderBy", params.orderBy);
    // }
    // const response = await axiosClients.get("users/assignments", {
    //   params: searchParams
    // });
    // return response.data;

    const mockData = {
      message: "Success",
      data: [
        {
          id: 1,
          assetCode: "A001",
          assetName: "Laptop",
          category: "Electronics",
          assignedDate: "2023-10-01",
          status: "WAITING",
        },
        {
          id: 2,
          assetCode: "A002",
          assetName: "Projector",
          category: "Electronics",
          assignedDate: "2023-10-05",
          status: "ACCEPTED",
        },
      ],
    };
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData);
      }, 1000);
    });
  },

  async getAssignmentDetail(
    assignmentId: number
  ): Promise<BaseResponseWithoutPagination<AssignmentDetail>> {
    // const response = await axiosClients.get(`users/assignments/${assignmentId}`);
    // return response.data;

    const mockData = {
      message: "Success",
      data: {
        id: assignmentId,
        assetCode: "A001",
        assetName: "Laptop",
        category: "Electronics",
        specification: "16GB RAM, 512GB SSD",
        assignedTo: "John Doe",
        assignedBy: "Jane Smith",
        note: "Handle with care",
        assignedDate: "2023-10-01",
        status: "WAITING",
      },
    };
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData);
      }, 1000);
    });
  },

  async acceptAssignment(assignmentId: number): Promise<void> {
    // const response = await axiosClients.post(`users/assignments/${assignmentId}/accept`);
    // return response.data;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  },

  async declineAssignment(assignmentId: number): Promise<void> {
    // const response = await axiosClients.post(`users/assignments/${assignmentId}/decline`);
    // return response.data;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  },

  async returnAssignment(assignmentId: number): Promise<void> {
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
