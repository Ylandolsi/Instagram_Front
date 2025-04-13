import { useState } from "react";
import { likesApi } from "@/api/likes";
import { toast } from "react-toastify";

export function useLikes(
  initialIsLiked: boolean,
  initialCount: number,
  entityId: string,
  isPost = true
) {
  const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked);
  const [likesCount, setLikesCount] = useState<number>(initialCount);
  const [likesOpen, setLikesOpen] = useState<boolean>(false);

  const toggleLike = async () => {
    try {
      setIsLiked(!isLiked);
      if (isPost) {
        await likesApi.toggleLikePost(entityId);
      } else {
        await likesApi.toggleLikeComment(entityId);
      }

      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (e) {
      toast.error(
        `Error ${isLiked ? "unliking" : "liking"} ${
          isPost ? "post" : "comment"
        }`
      );
      setIsLiked(!isLiked);
    }
  };

  const openHideLikes = () => {
    setLikesOpen(!likesOpen);
  };

  return { isLiked, likesCount, toggleLike, openHideLikes, likesOpen };
}
