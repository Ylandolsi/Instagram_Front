import { Post } from "@/types/post.types";
import { Loader } from "../common/Loader";
import React from "react";

interface PostsGridProps {
  posts: Post[];
  loading: boolean;
  loaderRef: React.RefObject<HTMLDivElement | null>;
}

export function PostsGrid({ posts, loading, loaderRef }: PostsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2 p-2">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex flex-col justify-center items-center">
          <img
            src={post.images[0].url}
            alt="Post"
            className="w-[200px] h-[200px] object-cover"
          />
        </div>
      ))}
      <div ref={loaderRef} className="h-10">
        {loading && (
          <div className="py-4 text-center">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}
