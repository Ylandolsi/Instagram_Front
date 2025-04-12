// import { Comment } from "@/types/comments.type";
// import { useState } from "react";
// import { toast } from "react-toastify";

// // hooks/useComments.ts
// export function useComments(postId: string, initialCount: number = 0) {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [commentsCount, setCommentsCount] = useState<number>(initialCount);
//   const [showComments, setShowComments] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasNextPage, setHasNextPage] = useState(true);

//   const toggleComments = () => {
//     if (!showComments && comments.length === 0) {
//       loadComments();
//     }
//     setShowComments(!showComments);
//   };

//   const loadComments = async (reset: boolean = false) => {
//     // Load comments implementation
//   };

//   const addComment = async (
//     content: string,
//     parentCommentId: string | null = null
//   ) => {
//     if (!user) {
//       toast.error("You must be logged in to comment");
//       return;
//     }
//     if (!contentComment.current) {
//       toast.error("Comment input not found");
//       return;
//     }
//     const content = contentComment.current?.value;
//     try {
//       if (!content || content.trim() === "") {
//         toast.error("Comment cannot be empty");
//         return;
//       }
//       await commentsApi.createComment(postData.id, content, parentCommentId);
//       setCommentsCount((prev) => prev + 1);
//       contentComment.current.value = "";

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

//   return {
//     comments,
//     commentsCount,
//     showComments,
//     loading,
//     hasNextPage,
//     toggleComments,
//     loadComments,
//     addComment,
//   };
// }
