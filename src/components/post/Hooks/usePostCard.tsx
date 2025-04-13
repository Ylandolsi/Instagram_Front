import { useState } from "react";
import { Post } from "@/types/post.types";
import { useLikes } from "../Likes/Hooks/useLikes";
import { useComments } from "../Comments/Hooks/useComments";
import { useAuth } from "@/contexts/authContext";

export function usePostCard(postData: Post) {
  const { user } = useAuth();
  const [showCommentForm, setShowCommentForm] = useState(false);

  const likes = useLikes(
    postData.isLikedByCurrentUser,
    postData.likeCount ?? 0,
    postData.id,
    true
  );

  const comments = useComments(postData.id, postData.commentCount ?? 0);

  const handlers = {
    toggleCommentForm: () => setShowCommentForm(!showCommentForm),
    toggleComments: () => comments.toggleVisibility(),
    loadMoreComments: () => comments.loadMore(),
    onCommentAdded: async () => {
      comments.incrementCount();
      setShowCommentForm(false);
      if (comments.visible) {
        await comments.refresh();
      }
      return Promise.resolve();
    },
    toggleLike: likes.toggleLike,
  };

  return {
    likes: {
      isLiked: likes.isLiked,
      count: likes.likesCount,
      modalOpen: likes.likesOpen,
      closeModal: likes.openHideLikes,
      openModal: likes.openHideLikes,
      toggleLike: likes.toggleLike,
    },
    comments: {
      shown: comments.visible,
      count: comments.count,
      items: comments.items,
      loading: comments.loading,
      hasNextPage: comments.hasNextPage,
      showForm: showCommentForm,
    },
    handlers,
    user,
  };
}
