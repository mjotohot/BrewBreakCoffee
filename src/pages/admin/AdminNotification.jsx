import { useEffect, useState } from "react";
import { getAllNotifications, getNotifications } from "../../services/notificationService";
import { useAuthStore } from "../../stores/useAuthStore";
import NotificationList from "../../components/commons/NotificationList";

export default function AdminNotification() {
  const userId = useAuthStore((state) => state.id);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const data = await getAllNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="flex flex-col items-center min-h-screen font-mono">
      <h1 className="w-full text-white font-extrabold text-xl text-center mb-5 border-b border-white pb-2">
        View daily updates from your activity
      </h1>

      <NotificationList notifications={notifications} loading={loading} />
    </div>
  );
}
