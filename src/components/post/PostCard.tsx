import { postsApi } from "@/api/posts";
import pdp from "@/assets/pdp.png";
import tt from "@/assets/tt.png";
import sc from "@/assets/sc.png";
import post from "@/assets/post.png";
import { Post } from "@/types/post.types";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { FaRegHeart } from "react-icons/fa6";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CarouselImage } from "./PostCarousel";
import { Image } from "@/types/image.type";
import { PostActions } from "./PostActions";
import { useState } from "react";

dayjs.extend(relativeTime);

function getRelativeTime(date: Date) {
  const dayjsDate = dayjs(date);
  return dayjsDate.fromNow();
}

export function PostCard({ postData }: { postData: Post | undefined }) {
  if (!postData) return null;
  const [isLiked, toggleLike] = useState<boolean>(
    postData.isLikedByCurrentUser
  );
  const [commentsShown, setCommentsShown] = useState(false);
  return (
    <div className="flex flex-col max-w-[468px] gap-2  rounded-lg p-4">
      <div className="flex justify-start gap-5 ">
        <div className="rounded-full overflow-hidden">
          <img
            src={postData.user.profilePictureUrl || pdp}
            width={50}
            alt="Profile picture"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://via.placeholder.com/80";
            }}
          />
        </div>
        <div className=" flex flex-col">
          <div className="font-bold">{postData.user.userName}</div>
          <div>{getRelativeTime(postData.createdAt)}</div>
        </div>
      </div>
      <CarouselImage images={postData.images} />
      <PostActions isLiked={postData.isLikedByCurrentUser} />
      <div className="font-medium">
        {postData.likeCount ?? 0}{" "}
        {(postData.likeCount ?? 0) > 1 ? "likes" : "like"}
      </div>
      <div className="text-wrap" style={{ overflowWrap: "break-word" }}>
        {" "}
        <span className="font-bold">@{postData.user.userName} : </span>
        {postData.caption}
      </div>
      <div className="text-gray-400/60">
        View all {postData.commentCount} comments
      </div>
    </div>
  );
}

// const test: Image[] = [
//   { id: "2", url: tt, order: 2, postId: "2" },
//   { id: "1", url: post, order: 1, postId: "1" },
//   { id: "3", url: sc, order: 1, postId: "1" },
// ];
