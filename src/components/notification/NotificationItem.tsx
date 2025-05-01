import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "@/contexts/notificationContext";
import { Notification, NotificationType } from "@/types/notification.type";
import { Loader } from "../common/Loader";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PostCard } from "../post/PostCard";
import { postsApi } from "@/api/posts";
import { Post } from "@/types/post.types";
import useOutsideClick from "@/hooks/useOutsideClick";

const NotificationItem = ({ notification }: { notification: Notification }) => {
  const { markAsRead, deleteNotification } = useNotifications();
  const [postView, setPostView] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const handleClick = async () => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    if (
      notification.type === NotificationType.comment ||
      notification.type === NotificationType.like
    ) {
      if (notification.post) {
        if (post === null) {
          setLoading(true);
          try {
            const postData = await postsApi.getPostById(notification.post.id);
            setPost(postData.data.data);
          } catch (error) {
            console.error("Error fetching post:", error);
          } finally {
            setLoading(false);
          }
        }
        setPostView(true);
      }
    } else if (notification.type === NotificationType.follow) {
      if (notification.user) {
        window.location.href = `/profile/${notification.user.id}`;
      }
    }
  };

  useOutsideClick(ref, () => {
    setPostView(false);
  });

  // prevent scrolling when postView is open
  useEffect(() => {
    if (postView) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [postView]);

  return (
    <div
      className={`pb-3 cursor-pointer ${
        notification.isRead
          ? "hover:bg-gray-200/10"
          : "bg-gray-900/30 hover:bg-gray-900/50 "
      } rounded-lg p-2`}
      onClick={handleClick}>
      <div className="relative flex gap-4 items-center">
        <div className="w-[60px] h-[60px] flex items-center justify-center">
          {notification.user && (
            <img
              src={notification.user.profilePictureUrl || "default-avatar.png"}
              alt="User"
              className="rounded-full w-full h-full"
            />
          )}
        </div>
        <div className={notification.isRead ? "font-medium" : "font-semibold"}>
          <p>
            {notification.content}{" "}
            {notification.type === NotificationType.comment && <span>💬</span>}
            {notification.type === NotificationType.like && <span>❤️</span>}
            {notification.type === NotificationType.follow && <span>👤</span>}
          </p>

          <span>
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (!notification.isRead) {
              markAsRead(notification.id);
            } else {
              deleteNotification(notification.id);
            }
          }}
          className={`${
            notification.isRead ? "" : "bg-blue-500"
          } w-[15px] h-[15px] rounded-full ml-auto transition-all duration-300 ease-in-out mr-3 cursor-pointer flex items-center justify-center hover:text-red-500`}>
          {notification.isRead ? <X /> : null}
        </div>
      </div>

      {postView && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-30">
          <div
            ref={ref}
            className="relative max-h-[90vh] max-w-[600px] overflow-y-auto overflow-x-hidden scale-80 md:scale-100 bg-[#191919] shadow-lg shadow-gray-500 rounded-lg flex justify-center">
            {loading ? (
              <div className="p-10 flex items-center justify-center">
                <Loader />
              </div>
            ) : post ? (
              <div className="p-5">
                <PostCard postData={post} />
              </div>
            ) : (
              <div className="p-5 text-center">Post not available</div>
            )}
            <button
              className="absolute top-2 right-2 text-white bg-black/20 rounded-full p-1 hover:bg-black/40 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setPostView(false);
              }}>
              <X size={24} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
