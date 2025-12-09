import Cards from "../../components/commons/Cards";
import { FaCircleCheck } from "react-icons/fa6";
import { FaTimesCircle } from "react-icons/fa";
import { FaBusinessTime, FaSignOutAlt } from "react-icons/fa";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useAuthStore } from "../../stores/useAuthStore";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { mapAttendanceToEvents } from "../../utils/attendanceMapper";
import { createNotification } from "../../services/notificationService";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import {
  getAttendanceByUser,
  timeInRequest,
  timeOutRequest,
} from "../../services/attendanceService";

export default function Dashboard() {
  const localizer = momentLocalizer(moment);
  const userId = useAuthStore((state) => state.id);
  const [events, setEvents] = useState([]);
  const [attendanceId, setAttendanceId] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const getDate = () => moment().format("YYYY-MM-DD");
  const getTime = () => moment().format("HH:mm:ss");
  const canTimeIn = !todayAttendance;
  const canTimeOut = todayAttendance && !todayAttendance.check_out;

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const records = await getAttendanceByUser(userId);
        const mapped = mapAttendanceToEvents(records);
        setEvents(mapped.sort((a, b) => a.start - b.start));
        const today = records.find((r) => r.date === getDate());
        if (today) {
          setTodayAttendance(today);
          setAttendanceId(today.id);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };
    fetchData();
  }, [userId]);

  const handleTimeIn = async () => {
    setLoading(true);
    try {
      const payload = {
        user_id: Number(userId),
        date: getDate(),
        check_in: getTime(),
      };
      const created = await timeInRequest(payload);
      setTodayAttendance(created);
      setAttendanceId(created.id);
      setEvents((prev) => [...prev, ...mapAttendanceToEvents([created])]);
      toast.success("Time In recorded!");
      // Create notification
      await createNotification({
        user_id: userId,
        notification_type: "attendance",
        status: "check_in",
      });
    } catch {
      toast.error("Error recording Time In.");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeOut = async () => {
    if (!canTimeOut) return toast.error("Already timed out!");
    setLoading(true);
    try {
      const check_out = getTime();
      await timeOutRequest(attendanceId, { check_out });
      const updated = { ...todayAttendance, check_out };
      setTodayAttendance(updated);
      setEvents((prev) => [
        ...prev,
        ...mapAttendanceToEvents([updated]).filter((e) => e.type === "out"),
      ]);
      toast.success("Time Out recorded!");
      // Create notification
      await createNotification({
        user_id: userId,
        notification_type: "attendance",
        status: "check_out",
      });
    } catch {
      toast.error("Error recording Time Out.");
    } finally {
      setLoading(false);
    }
  };

  const ColoredTimeEvent = ({ event }) => (
    <span
      style={{ color: event.type === "in" ? "green" : "red", fontWeight: 600 }}
    >
      {event.title}
    </span>
  );

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: "transparent",
      border: "none",
      padding: 0,
      margin: 0,
      boxShadow: "none",
    },
  });

  return (
    <>
      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 tracking-widest">
        {[
          { id: 1, count: "22", icon: FaCircleCheck, detail: "DAYS PRESENT" },
          { id: 2, count: "3", icon: FaTimesCircle, detail: "DAYS ABSENT" },
          { id: 3, count: "3", icon: FaSignOutAlt, detail: "LEAVE BALANCE" },
          { id: 4, count: "176", icon: FaBusinessTime, detail: "HOURS WORKED" },
        ].map((c) => (
          <Cards key={c.id} count={c.count} detail={c.detail} icon={c.icon} />
        ))}
      </div>

      {/* CALENDAR */}
      <div className="bg-[#d6ba73] p-5 mt-8 rounded-lg">
        <div className="flex items-center justify-between mb-5 font-mono">
          <h2 className="text-xl font-extrabold">Attendance Record</h2>
          <div className="flex gap-3">
            <button
              onClick={handleTimeIn}
              disabled={!canTimeIn || loading}
              className={`px-4 py-2 rounded-lg font-semibold ${
                !canTimeIn || loading ? "bg-green-200" : "bg-green-400"
              }`}
            >
              Time In
            </button>

            <button
              onClick={handleTimeOut}
              disabled={!canTimeOut || loading}
              className={`px-4 py-2 rounded-lg font-semibold ${
                !canTimeOut || loading ? "bg-red-300" : "bg-red-500"
              }`}
            >
              Time Out
            </button>
          </div>
        </div>

        <div
          style={{ height: "80vh" }}
          className="font-mono p-3 bg-white rounded-lg max-w-7xl"
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={["month", "agenda"]}
            components={{ event: ColoredTimeEvent }}
            eventPropGetter={eventStyleGetter}
          />
        </div>
      </div>
    </>
  );
}
