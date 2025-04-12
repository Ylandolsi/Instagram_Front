import api from "./axios";
import { User } from "@/types/auth.types";
import { Page } from "@/types/pagedresult";

export const likesApi = {
  toggleLikePost: async (postId: string) => {
    return await api.post(`Likes/posts/${postId}/toggle`);
  },
  toggleLikeComment: async (commentId: string) => {
    return await api.post(`Likes/comments/${commentId}/toggle`);
  },
  getUsersWhoLikedPost: async (
    postId: string,
    page: number = 10,
    pageSize: number = 20
  ) => {
    return (await api.get)<Page<User>>(
      `Likes/posts/${postId}/users?page=${page}&pageSize=${pageSize}`
    );
  },
};
