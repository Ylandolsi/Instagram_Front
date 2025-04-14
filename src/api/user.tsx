import api from "./axios";
import { apiResponse } from "@/types/apiResponse.type";
import { User } from "@/types/auth.types";
import { Page } from "@/types/pagedresult";

export const userApi = {
  getUserData: async (userId: string) => {
    return await api.get<apiResponse<User>>(`Users/${userId}`);
  },

  getFollowers: async (userId: string, page: number, pageSize: number) => {
    return await api.get<Page<User>>(
      `Users/${userId}/followers?page=${page}&pageSize=${pageSize}`
    );
  },
  getFollowing: async (userId: string, page: number, pageSize: number) => {
    return await api.get<Page<User>>(
      `Users/${userId}/following?page=${page}&pageSize=${pageSize}`
    );
  },
  FollowUser: async (userId: string) => {
    return await api.post<apiResponse<User>>(`Users/${userId}/follow`);
  },
  UnfollowUser: async (userId: string) => {
    return await api.post<apiResponse<User>>(`Users/${userId}/unfollow`);
  },
};
