import { postsApi } from "@/api/posts";
import { Post } from "@/types/post.types";
import { useCallback, useEffect, useState, useRef } from "react";
import { PostCard } from "./PostCard";
import { Loader } from "../common/Loader";
import { InfiniteScroll } from "../common/InfiniteScroll";

export function PostsFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const isFetching = useRef(false);

  const pageSize = 10;

  const loadMorePosts = useCallback(async () => {
    if (isFetching.current || !hasNextPage) {
      console.log(
        `Skipping fetch: isFetching=${isFetching.current}, hasNextPage=${hasNextPage}`
      );
      return;
    }

    isFetching.current = true;
    try {
      console.log("Fetching posts for page:", page);
      const response = await postsApi.getAllPosts(page, pageSize);
      const newItems = response.data.data.items;
      const newHasNextPage = response.data.data.hasNextPage;

      setPosts((prevPosts) => [...prevPosts, ...newItems]);
      setPage((prevPage) => prevPage + 1);
      setHasNextPage(newHasNextPage);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      isFetching.current = false;
    }
  }, [page, hasNextPage, pageSize]);

  useEffect(() => {
    console.log("Initial mount: Fetching first page.");
    loadMorePosts();
  }, []);

  return (
    <InfiniteScroll
      loadMore={loadMorePosts}
      canLoadMore={hasNextPage}
      isLoading={isFetching.current}
      loader={
        <div className="py-4 text-center">
          <Loader />
        </div>
      }
      endMessage={
        <p className="py-4 text-center text-gray-500">No more posts to load.</p>
      }
      className="max-w-[468px] mx-auto flex flex-col gap-2">
      {posts.map((postData) => (
        <PostCard key={postData.id} postData={postData} />
      ))}
    </InfiniteScroll>
  );
}
