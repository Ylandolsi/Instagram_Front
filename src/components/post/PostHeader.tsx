import pdp from "@/assets/pdp.png";
import { Post } from "@/types/post.types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function getRelativeTime(date: Date) {
  const dayjsDate = dayjs(date);
  return dayjsDate.fromNow();
}

function PostHeader({ postData }: { postData: Post }) {
  return (
    <div className="flex justify-start gap-5">
      <div className="rounded-full overflow-hidden">
        <img
          // change the default image
          src={postData.user.profilePictureUrl || pdp}
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
  );
}

export default PostHeader;
