import blankpdp from "@/assets/blankpdp.png";
import { Post } from "@/types/post.types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router-dom";

dayjs.extend(relativeTime);

function getRelativeTime(date: Date) {
  const dayjsDate = dayjs(date);
  return dayjsDate.fromNow();
}

function PostHeader({ postData }: { postData: Post }) {
  return (
    <Link to={`/profile/${postData.user.id}`}>
      <div className="flex justify-start gap-5">
        <div className="rounded-full overflow-hidden">
          <img
            src={postData.user.profilePictureUrl || blankpdp}
            width={50}
            alt="Profile picture"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://via.placeholder.com/80";
            }}
          />
        </div>
        <div className="flex flex-col">
          <div className="font-bold">{postData.user.userName}</div>
          <div>{getRelativeTime(postData.createdAt)}</div>
        </div>
      </div>
    </Link>
  );
}

export default PostHeader;
