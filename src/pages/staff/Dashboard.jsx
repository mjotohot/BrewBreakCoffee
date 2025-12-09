import Cards from "../../components/commons/Cards";
import { FaCircleCheck } from "react-icons/fa6";
import { FaTimesCircle } from "react-icons/fa";
import { FaBusinessTime } from "react-icons/fa";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useAuthStore } from "../../stores/useAuthStore";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { mapAttendanceToEvents } from "../../utils/attendanceMapper"; // Convert attendance data to calendar events
import { createNotification } from "../../services/notificationService"; // Function to create notifications
import {
  getDaysPresent,
  getDaysAbsent,
  getHoursWorkedThisMonth,
} from "../../utils/attendanceCounter"; // Functions to calculate stats
import "react-big-calendar/lib/css/react-big-calendar.css"; // Calendar CSS
import moment from "moment"; // Date library
import {
  getAttendanceByUser,
  timeInRequest,
  timeOutRequest,
} from "../../services/attendanceService"; // API calls for attendance

export default function Dashboard() {
  // Setup localizer for react-big-calendar
  const localizer = momentLocalizer(moment);

  // Get current user ID from global store
  const userId = useAuthStore((state) => state.id);

  // State variables
  const [events, setEvents] = useState([]); // Calendar events
  const [attendanceId, setAttendanceId] = useState(null); // Current day's attendance record ID
  const [todayAttendance, setTodayAttendance] = useState(null); // Current day's attendance record
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    hours: 0,
  }); // Stats for the cards
  const [loading, setLoading] = useState(false); // Loading state for Time In/Out buttons

  // Utility functions to get current date and time
  const getDate = () => moment().format("YYYY-MM-DD");
  const getTime = () => moment().format("HH:mm:ss");

  // Determine if user can time in or out
  const canTimeIn = !todayAttendance; // User can time in if no record exists
  const canTimeOut = todayAttendance && !todayAttendance.check_out; // User can time out if checked in but not checked out

  // Fetch attendance records when component mounts or userId changes
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const records = await getAttendanceByUser(userId); // Fetch user attendance
        const mapped = mapAttendanceToEvents(records); // Map attendance to calendar events

        setEvents(mapped.sort((a, b) => a.start - b.start)); // Sort events by start time

        // Find today's attendance record
        const today = records.find((r) => r.date === getDate());
        if (today) {
          setTodayAttendance(today);
          setAttendanceId(today.id);
        }

        // Update cards stats
        setStats({
          present: getDaysPresent(records),
          absent: getDaysAbsent(records),
          hours: getHoursWorkedThisMonth(records),
        });
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchData();
  }, [userId]);

  // Function to handle Time In action
  const handleTimeIn = async () => {
    setLoading(true);
    try {
      const payload = {
        user_id: Number(userId),
        date: getDate(),
        check_in: getTime(),
      };
      const created = await timeInRequest(payload); // Send Time In request
      setTodayAttendance(created); // Update today's attendance
      setAttendanceId(created.id); // Save attendance ID
      setEvents((prev) => [...prev, ...mapAttendanceToEvents([created])]); // Add new event to calendar
      toast.success("Time In recorded!"); // Show success message

      // Create a notification for Time In
      await createNotification({
        user_id: userId,
        notification_type: "attendance",
        status: "check_in",
      });
    } catch {
      toast.error("Error recording Time In."); // Show error message
    } finally {
      setLoading(false);
    }
  };

  // Function to handle Time Out action
  const handleTimeOut = async () => {
    if (!canTimeOut) return toast.error("Already timed out!");
    setLoading(true);
    try {
      const check_out = getTime();
      await timeOutRequest(attendanceId, { check_out }); // Send Time Out request
      const updated = { ...todayAttendance, check_out }; // Update today's record
      setTodayAttendance(updated);

      // Add Time Out event to calendar
      setEvents((prev) => [
        ...prev,
        ...mapAttendanceToEvents([updated]).filter((e) => e.type === "out"),
      ]);

      toast.success("Time Out recorded!"); // Show success message

      // Create a notification for Time Out
      await createNotification({
        user_id: userId,
        notification_type: "attendance",
        status: "check_out",
      });
    } catch {
      toast.error("Error recording Time Out."); // Show error message
    } finally {
      setLoading(false);
    }
  };

  // Component for coloring Time In/Out events in the calendar
  const ColoredTimeEvent = ({ event }) => (
    <span
      style={{ color: event.type === "in" ? "green" : "red", fontWeight: 600 }}
    >
      {event.title}
    </span>
  );

  // Remove default calendar event styling
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
      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 tracking-widest">
        {[
          {
            id: 1,
            count: stats.present,
            icon: FaCircleCheck,
            detail: "DAYS PRESENT",
          },
          {
            id: 2,
            count: stats.absent,
            icon: FaTimesCircle,
            detail: "DAYS ABSENT",
          },
          {
            id: 4,
            count: stats.hours,
            icon: FaBusinessTime,
            detail: "MONTHLY HOURS RENDERED",
          },
        ].map((c) => (
          <Cards key={c.id} count={c.count} detail={c.detail} icon={c.icon} />
        ))}
      </div>

      {/* ATTENDANCE CALENDAR */}
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
          className="font-mono p-3 bg-white rounded-lg"
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={["month", "week", "agenda"]}
            components={{ event: ColoredTimeEvent }} // Custom event color
            eventPropGetter={eventStyleGetter} // Remove default styling
          />
        </div>
      </div>
    </>
  );
}
