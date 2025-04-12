import pdp from "@/assets/pdp.png";
import { Post } from "@/types/post.types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CarouselImage } from "./PostCarousel";
import { PostActions } from "./PostActions";
import { useEffect, useRef, useState } from "react";
import { likesApi } from "@/api/likes";
import { ToastContainer, toast } from "react-toastify";
import { Likes } from "./Likes";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { commentsApi } from "@/api/comments";
import CommentItem from "./CommentItem";
import { Comment } from "@/types/comments.type";
dayjs.extend(relativeTime);

function getRelativeTime(date: Date) {
  const dayjsDate = dayjs(date);
  return dayjsDate.fromNow();
}

export function PostCard({ postData }: { postData: Post | undefined }) {
  const { user } = useAuth();
  if (!postData) return null;

  const [isLiked, setisLiked] = useState<boolean>(
    postData.isLikedByCurrentUser
  );
  const contentComment = useRef<HTMLInputElement | null>(null);
  const [commentsShown, setcommentsShown] = useState(false);
  const [commentsCount, setCommentsCount] = useState<number>(
    postData.commentCount ?? 0
  );
  const [likesCount, setLikesCount] = useState<number>(postData.likeCount ?? 0);
  const [likesOpen, setLikesOpen] = useState<boolean>(false);

  const [addCommentRoot, setAddCommentRoot] = useState<boolean>(false);
  const [commentsRoot, setCommentsRoot] = useState<Comment[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const pageSize = 5;
  const [page, setPage] = useState<number>(1);

  const toggleCommentReply = () => {
    setAddCommentRoot(!addCommentRoot);
  };
  const toggleLike = async () => {
    try {
      setisLiked(!isLiked);
      await likesApi.toggleLikePost(postData.id);
      if (isLiked) setLikesCount((prev) => prev - 1);
      else setLikesCount((prev) => prev + 1);
    } catch (e) {
      toast.error("Error liking post");
      setisLiked(!isLiked);
    }
  };

  const openHideLikes = () => {
    setLikesOpen(!likesOpen);
  };

  const addComment = async (parentCommentId: string | null = null) => {
    if (!user) {
      toast.error("You must be logged in to comment");
      return;
    }
    if (!contentComment.current) {
      toast.error("Comment input not found");
      return;
    }
    const content = contentComment.current?.value;
    try {
      if (!content || content.trim() === "") {
        toast.error("Comment cannot be empty");
        return;
      }
      await commentsApi.createComment(postData.id, content, parentCommentId);
      setCommentsCount((prev) => prev + 1);
      contentComment.current.value = "";

      // Refresh root comments if they're currently shown
      if (commentsShown && parentCommentId === null) {
        setPage(1);
        setCommentsRoot([]);
        loadRootComments(true);
      }
    } catch (e) {
      toast.error("Error adding comment");
    }
  };

  const loadRootComments = async (reset: boolean = false) => {
    if (loading) return;

    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const response = await commentsApi.getCommentsRoot(
        postData.id,
        currentPage,
        pageSize
      );

      if (reset) {
        setCommentsRoot(
          response.data.data.items.map((item: any) => mapToComment(item))
        );
      } else {
        setCommentsRoot((prev) => [
          ...prev,
          ...response.data.data.items.map((item: any) => mapToComment(item)),
        ]);
      }

      setPage(reset ? 2 : page + 1);
      setHasNextPage(response.data.data.hasNextPage);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const toggleCommentsShown = () => {
    if (!commentsShown && commentsRoot.length === 0) {
      loadRootComments(); // Load comments when showing for the first time
    }
    setcommentsShown(!commentsShown);
  };

  return (
    <div className="flex flex-col max-w-[468px] gap-2 rounded-lg p-4">
      <div className="flex justify-start gap-5">
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
        <div className="flex flex-col">
          <div className="font-bold">{postData.user.userName}</div>
          <div>{getRelativeTime(postData.createdAt)}</div>
        </div>
      </div>
      <CarouselImage images={postData.images} />
      <PostActions
        id={postData.id}
        isLiked={isLiked}
        toggleLike={toggleLike}
        toggleCommentReply={toggleCommentReply}
      />
      <div className="font-medium cursor-pointer" onClick={openHideLikes}>
        {likesCount ?? 0} {(likesCount ?? 0) > 1 ? "likes" : "like"}
      </div>
      <div className="text-wrap" style={{ overflowWrap: "break-word" }}>
        <span className="font-bold">@{postData.user.userName} : </span>
        {postData.caption}
      </div>
      <div className="flex">
        <div
          className="text-gray-400/60 cursor-pointer"
          onClick={toggleCommentsShown}>
          {commentsShown ? "Hide" : "View"} all {commentsCount} comments
        </div>
      </div>

      {commentsShown && (
        <div className="flex flex-col gap-2">
          {commentsRoot.map((comment: Comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}

          {loading && (
            <div className="text-sm text-gray-400">Loading comments...</div>
          )}

          {hasNextPage && !loading && (
            <div
              className="text-sm text-gray-400 cursor-pointer text-center"
              onClick={() => loadRootComments()}>
              Load more comments
            </div>
          )}
        </div>
      )}
      {addCommentRoot && (
        <div className="relative w-full rounded-lg">
          <Input
            className="px-10 overflow-hidden"
            placeholder="Add a new comment..."
            style={{ backgroundColor: "#1e1e1f", overflowWrap: "break-word" }}
            ref={contentComment}
          />
          <div className="absolute bottom-[13%] left-2">
            <img
              className="rounded-full"
              src={user?.profilePictureUrl || pdp}
              style={{ width: "25px" }}
              alt="Profile"
            />
          </div>
          <div
            className="absolute bottom-[13%] right-2 cursor-pointer"
            onClick={async () => {
              await addComment(null);
              setAddCommentRoot(false);
            }}>
            <Send />
          </div>
        </div>
      )}
      <Likes
        isOpen={likesOpen}
        openHideLikes={openHideLikes}
        isPost={true}
        id={postData.id}
        likesCount={likesCount}
        isLiked={isLiked}
      />
      <ToastContainer />
    </div>
  );
}

export function mapToComment(item: any): Comment {
  return {
    id: item.id,
    postId: item.postId,
    user: item.user,
    content: item.content,
    createdAt: item.createdAt,
    likeCount: item.likeCount || 0,
    isLikedByCurrentUser: item.isLikedByCurrentUser || false,
    parentCommentId: item.parentCommentId,
    replyCount: item.replyCount || 0,
  };
}
