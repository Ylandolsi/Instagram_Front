import { useState, useCallback } from "react";
import { Comment } from "@/types/comments.type";
import { commentsApi } from "@/api/comments";
import { toast } from "react-toastify";
import { mapToComment } from "../../utils/commentUtils";

export function useComments(postId: string, initialCount: number = 0) {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [items, setItems] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(1);
  const [content, setContent] = useState<string>("");
  const pageSize = 5;

  const toggleVisibility = useCallback(() => {
    if (!visible && items.length === 0) {
      loadComments(true);
    }
    setVisible(!visible);
  }, [visible, items.length]);

  const loadComments = useCallback(
    async (reset: boolean = false) => {
      if (loading) return;

      setLoading(true);
      try {
        const currentPage = reset ? 1 : page;
        const response = await commentsApi.getCommentsRoot(
          postId,
          currentPage,
          pageSize
        );

        if (reset) {
          setItems(
            response.data.data.items.map((item: any) => mapToComment(item))
          );
          setPage(2);
        } else {
          setItems((prev) => [
            ...prev,
            ...response.data.data.items.map((item: any) => mapToComment(item)),
          ]);
          setPage(currentPage + 1);
        }

        setHasNextPage(response.data.data.hasNextPage);
      } catch (error) {
        console.error("Error loading comments:", error);
        toast.error("Failed to load comments");
      } finally {
        setLoading(false);
      }
    },
    [postId, page, loading]
  );

  const incrementCount = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const refresh = useCallback(() => {
    setPage(1);
    setItems([]);
    loadComments(true);
  }, [loadComments]);

  return {
    visible,
    count,
    items,
    loading,
    hasNextPage,
    toggleVisibility,
    loadMore: () => loadComments(false),
    refresh,
    incrementCount,
    setContent,
    content,
  };
}
