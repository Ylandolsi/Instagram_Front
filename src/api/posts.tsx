import { Page } from "@/types/pagedresult";
import api, { API_URL } from "./axios";
import { Post } from "@/types/post.types";

export const postsApi = {
  getAllPosts: async (page: number = 1, pageSize: number = 20) => {
    return await api.get<Page<Post>>(
      `${API_URL}/posts?page=${page}&pageSize=${pageSize}`
    );
  },
};
