import { useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { Comment } from "@/types/comments.type";
import { commentsApi } from "@/api/comments";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { mapToComment } from "./PostCard";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function getRelativeTime(date: Date) {
  const dayjsDate = dayjs(date);
  return dayjsDate.fromNow();
}

const CommentItem = ({ comment }: { comment: Comment }) => {
  const { user } = useAuth();
  const [replyInputText, setReplyInputText] = useState("");
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [replyContent, setReplyContent] = useState<Comment[]>([]);
  const [openReplyComment, setOpenReplyComment] = useState<boolean>(false);
  const [repliesVisible, setRepliesVisible] = useState(false);
  const loadMoreReplies = async () => {
    if (loadingReplies || !hasNextPage) return;
    setLoadingReplies(true);

    try {
      const response = await commentsApi.getCommentsReplies(
        comment.id,
        page,
        5
      );

      setReplyContent([
        ...replyContent,
        ...response.data.data.items.map((item: any) => mapToComment(item)),
      ]);
      setPage(page + 1);
      setHasNextPage(response.data.data.hasNextPage);
    } catch (error) {
      console.error("Error loading more replies:", error);
      toast.error("Failed to load more replies");
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleAddReply = async () => {
    if (openReplyComment === false) {
      return;
    }
    if (!user) {
      toast.error("You must be logged in to reply");
      return;
    }

    if (!replyInputText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      await commentsApi.createComment(
        comment.postId,
        replyInputText,
        comment.id
      );
      comment.replyCount += 1;

      // Refresh replies of the comment ( where we have commented on )
      //  to show the new one
      setPage(1);
      setReplyContent([]);
      const response = await commentsApi.getCommentsReplies(comment.id, 1, 5);

      setReplyContent(
        response.data.data.items.map((item: any) => mapToComment(item))
      );
      setRepliesVisible(true);
      setReplyInputText("");
      setHasNextPage(response.data.data.hasNextPage);
      setPage(2);
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply");
    }
  };

  return (
    <div className="ml-2 mb-3">
      <div className="flex items-start gap-2">
        <img
          src={
            comment.user.profilePictureUrl || "https://via.placeholder.com/80"
          }
          className="w-8 h-8 rounded-full"
          alt={comment.user.userName}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://via.placeholder.com/80";
          }}
        />
        <div className="flex flex-col">
          <div>
            <span className="font-bold mr-2">{comment.user.userName}</span>
            <span>{comment.content}</span>
          </div>
          <div className="text-xs text-gray-400 flex gap-3">
            {getRelativeTime(comment.createdAt)}

            <span
              className="cursor-pointer"
              onClick={() => {
                setOpenReplyComment(!openReplyComment);
                setReplyInputText("");
              }}>
              {openReplyComment ? "Cancel" : "Reply"}
            </span>

            {comment.replyCount > 0 && (
              <span
                className="cursor-pointer"
                onClick={async () => {
                  await loadMoreReplies();
                  setRepliesVisible(!repliesVisible);
                }}>
                {repliesVisible ? "Hide replies" : `View replies`}
              </span>
            )}
          </div>
        </div>
      </div>

      {repliesVisible && replyContent.length > 0 && (
        <div className="ml-8 mt-2">
          {replyContent.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}

          {loadingReplies && (
            <div className="text-sm text-gray-400">Loading replies...</div>
          )}

          {hasNextPage && !loadingReplies && (
            <div
              className="text-sm text-gray-400 cursor-pointer"
              onClick={loadMoreReplies}>
              Load more replies
            </div>
          )}
        </div>
      )}
      {openReplyComment && (
        <div className="mt-2 ml-8 flex items-center gap-2">
          <Input
            className="text-sm"
            placeholder="Reply to comment..."
            value={replyInputText}
            onChange={(e) => setReplyInputText(e.target.value)}
          />
          <Send
            className="cursor-pointer"
            size={16}
            onClick={async () => {
              await handleAddReply();
              setOpenReplyComment(false);
            }}
          />
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default CommentItem;
