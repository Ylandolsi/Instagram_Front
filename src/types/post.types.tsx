import { User } from "./auth.types";
import { Image } from "./image.type";

export interface Post {
  id: string;
  user: User;
  images: Image[];
  commentCount?: number;
  likeCount?: number;
  createdAt: Date;
  isLikedByCurrentUser: boolean;
  caption?: string;
}
