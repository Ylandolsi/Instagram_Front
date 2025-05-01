import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import notificationApi from "@/api/notificaitons";
import signalRService from "@/services/SignalRService";
import { useAuth } from "./authContext";
import { Notification } from "@/types/notification.type";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: (restart?: boolean, page?: number) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  hasNextPage: boolean;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const handleNewNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  // Initialize SignalR connection
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Start connection
      signalRService
        .startConnection(user.id)
        .catch((error) =>
          console.error("Failed to establish SignalR connection:", error)
        );

      // Register callback
      signalRService.addCallback("notification", handleNewNotification);

      // Cleanup on unmount
      return () => {
        signalRService.removeCallback("notification", handleNewNotification);
        signalRService
          .stopConnection(user.id)
          .catch((error) =>
            console.error("Error stopping SignalR connection:", error)
          );
      };
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications(true);
    }
  }, [isAuthenticated]);

  const fetchNotifications = async (
    restart?: boolean,
    newPage?: number
  ): Promise<void> => {
    if (!hasNextPage || loading) return;
    setLoading(true);
    try {
      var pageToFetch = newPage !== undefined ? newPage : page;
      if (restart) {
        pageToFetch = 1;
      }
      const result = await notificationApi.getNotifications(pageToFetch);
      if (result.data) {
        if (restart) {
          setNotifications([...result.data.items] as unknown as Notification[]);
          setPage(2);
        } else {
          setNotifications(
            (prev) =>
              [...prev, ...result.data.items] as unknown as Notification[]
          );
          setPage((prev) => prev + 1);
        }
        setHasNextPage(result.data.hasNextPage);
        setUnreadCount(
          result.data.items.filter((n: unknown) => !(n as Notification).isRead)
            .length
        );
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string): Promise<void> => {
    try {
      const result = await notificationApi.markAsRead(id);
      if (result.data) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    try {
      const result = await notificationApi.markAllAsRead();
      if (result.data) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (id: string): Promise<void> => {
    try {
      const result = await notificationApi.deleteNotification(id);
      if (result.data) {
        const removedNotification = notifications.find((n) => n.id === id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));

        if (removedNotification && !removedNotification.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    hasNextPage,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
