import { User } from "./auth.types";

export interface Comment {
  id: string;
  postId: string;
  user: User;
  content: string;
  createdAt: Date;
  likeCount: number;
  isLikedByCurrentUser: boolean;
  parentCommentId: string | null;
  replyCount: number;
}
