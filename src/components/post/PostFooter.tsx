import { Post } from "@/types/post.types";

interface PostFooterProps {
  likesCount: number;
  commentsCount: number;
  onLikesClick: () => void;
  onCommentsClick: () => void;
  commentsShown: boolean;
  postData: Post;
}

export function PostFooter({
  likesCount,
  commentsCount,
  onLikesClick,
  onCommentsClick,
  commentsShown,
  postData,
}: PostFooterProps) {
  return (
    <>
      <div className="font-medium cursor-pointer" onClick={onLikesClick}>
        {likesCount ?? 0} {(likesCount ?? 0) > 1 ? "likes" : "like"}
      </div>
      <div className="text-wrap" style={{ overflowWrap: "break-word" }}>
        <span className="font-bold">@{postData.user.userName} : </span>
        {postData.caption || ""}
      </div>
      <div className="flex">
        <div
          className="text-gray-400/60 cursor-pointer"
          onClick={onCommentsClick}>
          {commentsShown ? "Hide" : "View"} all {commentsCount} comments
        </div>
      </div>
    </>
  );
}
