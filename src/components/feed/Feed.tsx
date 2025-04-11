import { PostCard } from "@/components/post/PostCard";
import { PostsFeed } from "../post/PostsFeed";

export function Feed() {
  return (
    <div className="max-w-[630px] mt-9">
      <div className="flex justify-center">
        <PostsFeed />
      </div>
    </div>
  );
}
