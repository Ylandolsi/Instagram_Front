import { Comment } from "@/types/comments.type";
import CommentItem from "./CommentItem";

interface CommentsSectionProps {
  postId: string;
  shown: boolean;
  comments: Comment[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
}

export function CommentsSection({
  shown,
  comments,
  loading,
  hasMore,
  loadMore,
}: CommentsSectionProps) {
  if (!shown) return null;

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}

      {loading && (
        <div className="text-sm text-gray-400">Loading comments...</div>
      )}

      {hasMore && !loading && (
        <div
          className="text-sm text-gray-400 cursor-pointer text-center"
          onClick={loadMore}>
          Load more comments
        </div>
      )}
    </div>
  );
}
