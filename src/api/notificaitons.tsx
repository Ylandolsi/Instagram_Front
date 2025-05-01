import { Page } from "@/types/pagedresult";
import api, { API_URL } from "./axios";

const notificationApi = {
  async getNotifications(page = 1, pageSize = 20) {
    const response = await api.get<Page<Notification>>(
      `${API_URL}/Notifications?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  async getNotification(id: string) {
    const response = await api.get(`${API_URL}/Notifications/${id}`);
    return response.data;
  },
  async markAsRead(id: string) {
    const response = await api.post(`${API_URL}/Notifications/${id}/read`);
    return response.data;
  },
  async markAllAsRead() {
    const response = await api.post(`${API_URL}/Notifications/read-all`);
    return response.data;
  },
  async deleteNotification(id: string) {
    const response = await api.delete(`${API_URL}/Notifications/${id}`);
    return response.data;
  },
};
export default notificationApi;
