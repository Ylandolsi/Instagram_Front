// import { Post } from "@/types/post.types";
// import { CarouselImage } from "./PostCarousel";
// import { PostActions } from "./PostActions";
// import { useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import { Likes } from "./Likes/Likes";
// import { useAuth } from "@/contexts/authContext";
// import { commentsApi } from "@/api/comments";
// import CommentItem from "./Comments/CommentItem";
// import { Comment } from "@/types/comments.type";
// import PostHeader from "./PostHeader";
// import { useLikes } from "@/components/post/Likes/useLikes";
// import { CommentForm } from "./Comments/CommentForm";

// export function PostCard({ postData }: { postData: Post | undefined }) {
//   const { user } = useAuth();
//   if (!postData) return null;

//   const { isLiked, likesCount, toggleLike, openHideLikes, likesOpen } =
//     useLikes(
//       postData.isLikedByCurrentUser,
//       postData.likeCount ?? 0,
//       postData.id,
//       true
//     );

//   const [contentComment, setcontentComment] = useState("");

//   const [commentsShown, setcommentsShown] = useState(false);
//   const [commentsCount, setCommentsCount] = useState<number>(
//     postData.commentCount ?? 0
//   );

//   const [addCommentRoot, setAddCommentRoot] = useState<boolean>(false);
//   const [commentsRoot, setCommentsRoot] = useState<Comment[]>([]);
//   const [hasNextPage, setHasNextPage] = useState<boolean>(true);
//   const [loading, setLoading] = useState<boolean>(false);
//   const pageSize = 5;
//   const [page, setPage] = useState<number>(1);

//   const toggleCommentReply = () => {
//     setAddCommentRoot(!addCommentRoot);
//   };

//   const addComment = async (parentCommentId: string | null = null) => {
//     if (!user) {
//       toast.error("You must be logged in to comment");
//       return;
//     }

//     const content = contentComment;
//     try {
//       if (!content || content.trim() === "") {
//         toast.error("Comment cannot be empty");
//         return;
//       }
//       await commentsApi.createComment(postData.id, content, parentCommentId);
//       setCommentsCount((prev) => prev + 1);
//       setcontentComment("");

//       // Refresh root comments if they're currently shown
//       if (commentsShown && parentCommentId === null) {
//         setPage(1);
//         setCommentsRoot([]);
//         loadRootComments(true);
//       }
//     } catch (e) {
//       toast.error("Error adding comment");
//     }
//   };

//   const loadRootComments = async (reset: boolean = false) => {
//     if (loading) return;

//     setLoading(true);
//     try {
//       const currentPage = reset ? 1 : page;
//       const response = await commentsApi.getCommentsRoot(
//         postData.id,
//         currentPage,
//         pageSize
//       );

//       if (reset) {
//         setCommentsRoot(
//           response.data.data.items.map((item: any) => mapToComment(item))
//         );
//       } else {
//         setCommentsRoot((prev) => [
//           ...prev,
//           ...response.data.data.items.map((item: any) => mapToComment(item)),
//         ]);
//       }

//       setPage(reset ? 2 : page + 1);
//       setHasNextPage(response.data.data.hasNextPage);
//     } catch (error) {
//       console.error("Error loading comments:", error);
//       toast.error("Failed to load comments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleCommentsShown = () => {
//     if (!commentsShown && commentsRoot.length === 0) {
//       loadRootComments(); // Load comments when showing for the first time
//     }
//     setcommentsShown(!commentsShown);
//   };

//   return (
//     <div className="flex flex-col max-w-[468px] gap-2 rounded-lg p-4 ">
//       <PostHeader postData={postData} />
//       <CarouselImage images={postData.images} />
//       <PostActions
//         id={postData.id}
//         isLiked={isLiked}
//         toggleLike={toggleLike}
//         toggleCommentReply={toggleCommentReply}
//       />
//       <div className="font-medium cursor-pointer" onClick={openHideLikes}>
//         {likesCount ?? 0} {(likesCount ?? 0) > 1 ? "likes" : "like"}
//       </div>
//       <div className="text-wrap" style={{ overflowWrap: "break-word" }}>
//         <span className="font-bold">@{postData.user.userName} : </span>
//         {postData.caption}
//       </div>
//       <div className="flex">
//         <div
//           className="text-gray-400/60 cursor-pointer"
//           onClick={toggleCommentsShown}>
//           {commentsShown ? "Hide" : "View"} all {commentsCount} comments
//         </div>
//       </div>

//       {commentsShown && (
//         <div className="flex flex-col gap-2">
//           {commentsRoot.map((comment: Comment) => (
//             <CommentItem key={comment.id} comment={comment} />
//           ))}

//           {loading && (
//             <div className="text-sm text-gray-400">Loading comments...</div>
//           )}

//           {hasNextPage && !loading && (
//             <div
//               className="text-sm text-gray-400 cursor-pointer text-center"
//               onClick={() => loadRootComments()}>
//               Load more comments
//             </div>
//           )}
//         </div>
//       )}
//       {addCommentRoot && (
//         <CommentForm
//           contentComment={contentComment}
//           setcontentComment={setcontentComment}
//           profilePicture={user?.profilePictureUrl}
//           handleSend={async () => {
//             await addComment(null);
//             setAddCommentRoot(false);
//           }}
//         />
//       )}
//       <Likes
//         isOpen={likesOpen}
//         openHideLikes={openHideLikes}
//         isPost={true}
//         id={postData.id}
//         likesCount={likesCount}
//       />
//       <ToastContainer />
//     </div>
//   );
// }

// export function mapToComment(item: any): Comment {
//   return {
//     id: item.id,
//     postId: item.postId,
//     user: item.user,
//     content: item.content,
//     createdAt: item.createdAt,
//     likeCount: item.likeCount || 0,
//     isLikedByCurrentUser: item.isLikedByCurrentUser || false,
//     parentCommentId: item.parentCommentId,
//     replyCount: item.replyCount || 0,
//   };
// }

import { Post } from "@/types/post.types";
import { usePostCard } from "./Hooks/usePostCard";
import PostHeader from "./PostHeader";
import { PostActions } from "./PostActions";
import { PostFooter } from "./PostFooter";
import { CarouselImage } from "./PostCarousel";
import { CommentsSection } from "./Comments/CommentSection";
import { LikesModal } from "./Likes/LikesModal";
import { CommentForm } from "./Comments/CommentForm";
import { useAuth } from "@/contexts/authContext";
import { ToastContainer } from "react-toastify";

export function PostCard({ postData }: { postData: Post | undefined }) {
  if (!postData) return null;

  const { likes, comments, handlers } = usePostCard(postData);
  const { user } = useAuth();

  return (
    <div className="flex flex-col max-w-[468px] gap-2 rounded-lg p-4">
      <PostHeader postData={postData} />
      <CarouselImage images={postData.images} />
      <PostActions
        id={postData.id}
        isLiked={likes.isLiked}
        toggleLike={handlers.toggleLike}
        toggleCommentReply={handlers.toggleCommentForm}
      />
      <PostFooter
        likesCount={likes.count}
        commentsCount={comments.count}
        onLikesClick={likes.openModal}
        onCommentsClick={handlers.toggleComments}
        commentsShown={comments.shown}
        postData={postData}
      />

      <CommentsSection
        postId={postData.id}
        shown={comments.shown}
        comments={comments.items}
        loading={comments.loading}
        hasMore={comments.hasNextPage}
        loadMore={handlers.loadMoreComments}
      />

      {comments.showForm && (
        <CommentForm
          contentComment=""
          setcontentComment={() => {}}
          profilePicture={user?.profilePictureUrl}
          handleSend={async () => await handlers.onCommentAdded()}
          placeholder="Add a comment..."
        />
      )}

      <LikesModal
        isOpen={likes.modalOpen}
        onClose={likes.closeModal}
        postId={postData.id}
        likesCount={likes.count}
      />

      <ToastContainer />
    </div>
  );
}
