import { Comment } from "@/types/comments.type";

export function mapToComment(item: any): Comment {
  return {
    id: item.id,
    postId: item.postId,
    user: item.user,
    content: item.content,
    createdAt: item.createdAt,
    likeCount: item.likeCount || 0,
    isLikedByCurrentUser: item.isLikedByCurrentUser || false,
    parentCommentId: item.parentCommentId,
    replyCount: item.replyCount || 0,
  };
}
