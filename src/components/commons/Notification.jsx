import { useEffect, useState } from "react";
import { FaCheckCircle, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { getNotifications } from "../../services/notificationService";
import { useAuthStore } from "../../stores/useAuthStore";
import moment from "moment";

export default function Notification() {
  const userId = useAuthStore((state) => state.id);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const data = await getNotifications(userId);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const getIcon = (type, status) => {
    if (type === "attendance")
      return status === "check_in" ? <FaSignInAlt /> : <FaSignOutAlt />;
    return <FaCheckCircle />;
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-5 font-mono">
      <h1 className="w-full text-white font-extrabold text-xl text-center mb-5 border-b border-white pb-2">
        View daily updates from your activity
      </h1>

      {loading ? (
        <p className="text-white text-md italic mt-10">
          Loading notifications...
        </p>
      ) : notifications.length === 0 ? (
        <p className="text-white text-md italic mt-10">No notifications yet.</p>
      ) : (
        <div className="flex flex-col items-center space-y-4 w-full max-w-4xl">
          {notifications.map((c) => (
            <div
              key={c.id}
              className="card shadow-md bg-[#d6ba73] p-5 rounded-lg font-mono w-full"
            >
              <div className="card-body flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {getIcon(c.notification_type, c.status)}
                  <span className="text-lg font-extrabold font-mono text-[#4a2204] tracking-normal">
                    {c.text || `${c.notification_type} ${c.status}`}
                  </span>
                </div>
                <p>{moment(c.created_at).fromNow()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
