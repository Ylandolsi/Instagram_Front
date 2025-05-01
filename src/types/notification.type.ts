import { User } from "./auth.types";
import { Post } from "./post.types";
export enum NotificationType {
  like,
  comment,
  follow,
}
export interface Notification {
  id: string;
  type: NotificationType;
  content: string;
  createdAt: Date;
  isRead: boolean;
  post?: Post;
  comment?: Comment;
  user?: User;
}
