import { PostsFeed } from "../post/PostsFeed";

export function Feed() {
  return (
    <div className="max-w-[630px] ">
      <div className="flex justify-center">
        <PostsFeed />
      </div>
    </div>
  );
}
