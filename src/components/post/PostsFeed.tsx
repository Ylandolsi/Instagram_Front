import { postsApi } from "@/api/posts";
import { Post } from "@/types/post.types";
import { useCallback, useEffect, useState, useRef } from "react";
import { PostCard } from "./PostCard";
import { Loader } from "../common/Loader";

export function PostsFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loaderElementRef = useRef<HTMLDivElement | null>(null);

  const pageSize = 5;

  const fetchPosts = useCallback(async () => {
    if (!hasNextPage || loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      console.log("Fetching posts for page:", page);
      const response = await postsApi.getAllPosts(page, pageSize);
      setPosts((prevPosts) => [...prevPosts, ...response.data.data.items]);
      setPage((prevPage) => prevPage + 1);
      setHasNextPage(response.data.data.hasNextPage);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [hasNextPage, page, pageSize]);

  useEffect(() => {
    if (page === 1) {
      fetchPosts();
    }

    const options = {
      root: null, // viewport (entire screen )
      rootMargin: "100px", // add 100px to space of viewport (from top && bottom)
      threshold: 0.1, // trigger when 10% of the target is visible
    };

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !loadingRef.current && hasNextPage) {
        console.log("Scroll threshold reached via IntersectionObserver");
        fetchPosts();
      }
    }, options);

    observerRef.current = observer;

    if (loaderElementRef.current) {
      observer.observe(loaderElementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchPosts, hasNextPage, page]);

  return (
    <div className="max-w-[468px] mx-auto flex flex-col gap-2">
      {posts.map((postData) => (
        <PostCard key={postData.id} postData={postData} />
      ))}

      <div ref={loaderElementRef} className="h-10 w-full">
        {loading && (
          <div className="py-4 text-center">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}
