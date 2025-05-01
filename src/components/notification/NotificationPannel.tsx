import { Link } from "react-router-dom";
import NotificationItem from "./NotificationItem";
import { useNotifications } from "@/contexts/notificationContext";
import { Button } from "../ui/button";
import { Loader } from "../common/Loader";

export const NotificationPanel = () => {
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAllAsRead,
    hasNextPage,
  } = useNotifications();

  console.log(notifications);

  return (
    <div className="flex flex-col gap-4 w-full max-w-[400px] p-4 items-start justify-center mx-auto mt-3">
      <div className="flex justify-between w-full border-b pb-4">
        <div className="flex flex-col items-end gap-3">
          <h4 className="font-bold">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              className="hover-bg-gray-400 cursor-pointer">
              Mark all as read
            </Button>
          )}
        </div>
        <div>
          <Link to="/">&#10006;</Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full divide-accent-200 divide-y-1">
        {loading ? (
          <Loader />
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))
        ) : (
          <div className="empty-state">No notifications yet</div>
        )}
      </div>

      {!loading && hasNextPage && (
        <Button className="w-[80%] mx-auto">Load more notification</Button>
      )}
    </div>
  );
};
