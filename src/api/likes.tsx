import api from "./axios";

export const likesApi = {
  toggleLikePost: async (postId: string) => {
    return await api.post(`Likes/posts/${postId}/toggle`);
  },
  toggleLikeComment: async (commentId: string) => {
    return await api.post(`Likes/comments/${commentId}/toggle`);
  },
  getUsersWhoLikedPost: async (postId: string) => {
    return await api.get(`Likes/posts/${postId}/users`);
  },
};
