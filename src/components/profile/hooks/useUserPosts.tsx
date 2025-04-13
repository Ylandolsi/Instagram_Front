import { useState, useEffect, useRef, useCallback } from "react";
import { Post } from "@/types/post.types";
import { postsApi } from "@/api/posts";

export function useUserPosts(userId: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pageSize = 5;

  const loadPosts = useCallback(
    async (reset: boolean = false) => {
      if ((!hasNextPage && !reset) || loading) return;

      setLoading(true);
      setError(null);

      try {
        const currentPage = reset ? 1 : page;
        const response = await postsApi.getPostsByUserId(
          userId,
          currentPage,
          pageSize
        );

        if (reset) {
          setPosts(response.data.data.items);
          setPage(2);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...response.data.data.items]);
          setPage(currentPage + 1);
        }

        setHasNextPage(response.data.data.hasNextPage);
      } catch (error) {
        console.error("Failed to load posts:", error);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    },
    [userId, page, hasNextPage, loading, pageSize]
  );

  // Initial load && reset
  useEffect(() => {
    loadPosts(true);
  }, [userId]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !loading && hasNextPage) {
        loadPosts(false);
      }
    }, options);

    observerRef.current = observer;

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadPosts, loading, hasNextPage]);

  return { posts, loading, error, loaderRef };
}
