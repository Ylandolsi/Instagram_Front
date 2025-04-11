import { postsApi } from "@/api/posts";
import { Post } from "@/types/post.types";
import { useEffect, useState } from "react";
import { PostCard } from "./PostCard";

export function PostsFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(true);

  const pageSize = 20;

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postsApi.getAllPosts(page, pageSize);
      setPosts([...posts, ...response.data.data.items]);
      setPage(page + 1);
      setLoading(false);
      setHasNextPage(response.data.data.hasNextPage);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (loading || !hasNextPage) return;
    await fetchPosts();
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 50
    ) {
      loadMorePosts();
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  console.log("posts", posts);

  return (
    <div className="w-[468px] mx-auto flex flex-col gap-2">
      {posts.map((postData) => (
        <PostCard key={postData.id} postData={postData} />
      ))}
    </div>
  );
}
