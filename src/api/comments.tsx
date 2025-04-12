import { apiResponse } from "@/types/apiResponse.type";
import api from "./axios";
import { Page } from "@/types/pagedresult";

export const commentsApi = {
  createComment: async (
    postId: string,
    content: string,
    parentCommentId: string | null = null
  ) => {
    return await api.post<apiResponse<boolean>>(`Comments`, {
      postId,
      content,
      parentCommentId,
    });
  },
  getCommentsRoot: async (postId: string, page: number, pageSize: number) => {
    return (await api.get)<Page<Comment>>(
      `Comments/posts/${postId}?page=${page}&pageSize=${pageSize}`
    );
  },
  getCommentsReplies: async (
    commentId: string,
    page: number,
    pageSize: number
  ) => {
    return await api.get<Page<Comment>>(
      `Comments/replies/${commentId}?page=${page}&pageSize=${pageSize}`
    );
  },
};
