import { BaseResponse, BaseResponseWithoutPagination } from "../types";
import { Notification } from "../types/notification";
import axiosClients from "./axiosClients";

const notificationApi = {
  getNotificationList(): Promise<BaseResponseWithoutPagination<Notification[]>> {
    const url = `notifications`
    return axiosClients.get(url);
  },

  getNotificationUnreadCount(): Promise<BaseResponseWithoutPagination<number>> {
    const url = `notifications/unread-count`
    return axiosClients.get(url);
  },

  markAsRead(
    notificationId: number
  ): Promise<BaseResponseWithoutPagination<boolean>> {
    const url = `notifications/${notificationId}/mark-as-read`;
    return axiosClients.patch(url);
  },

  markAsAllRead(): Promise<BaseResponseWithoutPagination<boolean>> {
    const url = `notifications/mark-all-as-read`;
    return axiosClients.patch(url);
  }
};

export default notificationApi;