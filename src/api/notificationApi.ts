import { BaseResponseWithoutPagination } from "../types";
import { Notification } from "../types/notification";
import axiosClients from "./axiosClients";

const mockNotifications: Notification[] = [
  {
    id: 1,
    senderName: "Admin1",
    type: "ASSIGNMENT_CREATED",
    assetName: "Laptop Dell",
    isRead: false,
    createdAt: "2025-06-08T10:00:00Z"
  },
  {
    id: 2,
    senderName: "Admin2",
    type: "RETURN_REQUEST_CREATED",
    assetName: "Monitor LG",
    isRead: false,
    createdAt: "2025-06-08T11:30:00Z"
  },
  {
    id: 3,
    senderName: "Admin3",
    type: "RETURN_REQUEST_COMPLETED",
    assetName: "Mouse Logitech",
    isRead: true,
    createdAt: "2025-06-07T15:45:00Z"
  },
  {
    id: 4,
    senderName: "Admin4",
    type: "RETURN_REQUEST_REJECTED",
    assetName: "Keyboard HP",
    isRead: false,
    createdAt: "2025-06-06T09:15:00Z"
  },
  {
    id: 5,
    senderName: "Admin5",
    type: "ASSIGNMENT_ACCEPTED",
    assetName: "Tablet iPad",
    isRead: true,
    createdAt: "2025-06-05T13:00:00Z"
  },
  {
    id: 6,
    senderName: "Admin6",
    type: "ASSIGNMENT_REJECTED",
    assetName: "Printer Canon",
    isRead: false,
    createdAt: "2025-06-04T08:20:00Z"
  },
  {
    id: 7,
    senderName: "User1",
    type: "USER_RETURN_REQUEST_CREATED",
    assetName: "Scanner Epson",
    isRead: true,
    createdAt: "2025-06-03T17:10:00Z"
  },
  {
    id: 8,
    senderName: "Admin7",
    type: "ANOTHER_ADMIN_RETURN_REQUEST_CREATED",
    assetName: "Docking Station",
    isRead: false,
    createdAt: "2025-06-02T14:05:00Z"
  },
  {
    id: 9,
    senderName: "Admin8",
    type: "ANOTHER_ADMIN_RETURN_REQUEST_COMPLETED",
    assetName: "External HDD",
    isRead: true,
    createdAt: "2025-06-01T12:30:00Z"
  },
  {
    id: 10,
    senderName: "Admin9",
    type: "ANOTHER_ADMIN_RETURN_REQUEST_REJECTED",
    assetName: "Webcam Logitech",
    isRead: false,
    createdAt: "2025-05-31T10:50:00Z"
  }
]

const notificationApi = {
  // getNotificationList(): Promise<BaseResponseWithoutPagination<string>> {
  //   const url = `notifications`
  //   return axiosClients.get(url);
  // }

  getNotificationList(): Promise<{ data: Notification[] }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockNotifications })
      }, 300);
    });
  }
};

export default notificationApi;