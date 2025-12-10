import moment from "moment";
import { FaCheckCircle, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

export default function NotificationList({ notifications = [], loading }) {
  const getIcon = (type, status) => {
    if (type === "attendance")
      return status === "check_in" ? <FaSignInAlt /> : <FaSignOutAlt />;
    return <FaCheckCircle />;
  };

  if (loading) {
    return (
      <p className="text-white text-md italic mt-10">
        Loading notifications...
      </p>
    );
  }

  if (!loading && notifications.length === 0) {
    return (
      <p className="text-white text-md italic mt-10">No notifications yet.</p>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-4xl">
      {notifications.map((c) => (
        <div
          key={c.id}
          className="card shadow-md bg-[#d6ba73] p-5 rounded-lg font-mono w-full"
        >
          <div className="card-body flex justify-between items-center">
            <div className="flex items-center gap-3">
              {getIcon(c.notification_type, c.status)}
              <span className="text-lg font-extrabold font-mono text-[#4a2204]">
              {c.user.name}  {c.text || `${c.notification_type} ${c.status}`}
              </span>
            </div>
            <p>{moment(c.created_at).fromNow()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
