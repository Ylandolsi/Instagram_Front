import { Post } from "@/types/post.types";
import { Loader } from "../common/Loader";
import React, { use, useState } from "react";
import { PostCard } from "../post/PostCard";
import useOutsideClick from "@/hooks/useOutsideClick";
import { X } from "lucide-react";

interface PostsGridProps {
  posts: Post[];
  loading: boolean;
  loaderRef: React.RefObject<HTMLDivElement | null>;
}
// gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",

export function PostsGrid({ posts, loading, loaderRef }: PostsGridProps) {
  const [postSelected, setPostSelected] = useState<number | null>(null);
  console.log("postSelected", postSelected);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const close = () => {
    if (ref === null) return;
    if (ref.current) setPostSelected(null);
    window.location.reload();
  };
  useOutsideClick(ref, close);

  return (
    <div className="grid grid-cols-3 gap-2 p-2  justify-items-center">
      {posts.map((post, index) => (
        <div
          onClick={() => setPostSelected(index)}
          key={post.id}
          className="aspect-square w-full md:w-[90%] overflow-hidden">
          <img
            src={post.images[0].url}
            alt="Post"
            className="w-full h-full object-cover"
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
      {postSelected != null && (
        <div className="fixed w-screen h-screen inset-0  bg-opacity-50 backdrop-blur flex justify-center items-center z-30 ">
          <div
            ref={ref}
            className="relative max-h-[90vh] max-w-[600px]  overflow-auto scale-80 md:scale-100 bg-[#191919] shadow-lg shadow-gray-500 rounded-lg  flex justify-center   ">
            <div className="p-5">
              <PostCard postData={posts[postSelected] as Post} />
            </div>
            <div>
              <button
                className="absolute top-2 right-2 text-white"
                onClick={() => setPostSelected(null)}>
                <X size={40} className="text-red-400/40" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
