import { Page } from "@/types/pagedresult";
import api from "./axios";
import { Post } from "@/types/post.types";
import { apiResponse } from "@/types/apiResponse.type";

export const postsApi = {
  getAllPosts: async (page: number = 1, pageSize: number = 20) => {
    return await api.get<Page<Post>>(`posts?page=${page}&pageSize=${pageSize}`);
  },
  getPostById: async (postId: string) => {
    return await api.get<apiResponse<Post>>(`posts/${postId}`);
  },
  getPostsByUserId: async (userId: string, page: number, pageSize: number) => {
    return await api.get<Page<Post>>(
      `Posts/User/${userId}?page=${page}&pageSize=${pageSize}`
    );
  },

  createPost: async (Caption: string, files: File[]) => {
    const formData = new FormData();

    formData.append("caption", Caption);

    files.forEach((file) => {
      formData.append("file", file);
    });

    return await api.post<apiResponse<Post>>("posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
