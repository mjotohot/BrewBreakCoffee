import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { getAttendanceByUser } from "../../services/attendanceService";
import {
  calculateAttendanceStats,
  DAILY_RATE,
  LATE_PENALTY_PER_HOUR,
} from "../../utils/salaryCounter";
import moment from "moment";
import { toast } from "react-hot-toast";

export default function Profile() {
  const userId = useAuthStore((state) => state.id);
  const userName = useAuthStore((state) => state.user.name);
  const userEmail = useAuthStore((state) => state.user.email);

  const [attendance, setAttendance] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    moment().format("YYYY-MM")
  );
  const [dateStarted, setDateStarted] = useState(null);

  // Generate list of months from earliest attendance to current month
  const getMonthOptions = () => {
    const months = [];

    // If no dateStarted yet, return current month only
    if (!dateStarted) {
      return [
        {
          value: moment().format("YYYY-MM"),
          label: moment().format("MMMM YYYY"),
        },
      ];
    }

    const start = moment(dateStarted);
    const end = moment();

    let current = start.clone().startOf("month");
    while (current.isSameOrBefore(end, "month")) {
      months.push({
        value: current.format("YYYY-MM"),
        label: current.format("MMMM YYYY"),
      });
      current.add(1, "month");
    }

    return months.reverse(); // Most recent first
  };

  // Calculate next pay date (monthly 25th)
  const getNextPayDate = () => {
    const today = moment();
    let payDate = moment(`${today.year()}-${today.month() + 1}-25`);
    if (today.isAfter(payDate)) payDate = payDate.add(1, "month");
    return payDate.format("YYYY-MM-DD");
  };

  // Fetch attendance data once
  useEffect(() => {
    if (!userId) return;

    const fetchAttendance = async () => {
      try {
        const records = await getAttendanceByUser(userId);
        setAttendance(records);

        // Find the earliest date as the start date
        if (records.length > 0) {
          const earliestDate = records.reduce((earliest, record) => {
            return moment(record.date).isBefore(moment(earliest))
              ? record.date
              : earliest;
          }, records[0].date);
          setDateStarted(earliestDate);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
        toast.error("Failed to load attendance data");
      }
    };

    fetchAttendance();
  }, [userId]);

  const stats = useMemo(() => {
    return calculateAttendanceStats(attendance, selectedMonth, dateStarted);
  }, [attendance, selectedMonth, dateStarted]);

  return (
    <div className="font-mono">
      <div className="flex justify-between items-center mb-5 border-b border-white">
        <h1 className="w-full text-white font-extrabold text-xl pb-2">
          View your Profile and Monthly Salary
        </h1>

        {/* Month Filter */}
        <div className="flex items-center gap-2 pb-1">
          <label className="text-sm font-bold text-white ">Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-[#d6ba73] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d6ba73]"
          >
            {getMonthOptions().map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden mb-8 grid grid-cols-1 md:grid-cols-2 shadow-lg">
        {/* LEFT SIDE – SALARY SUMMARY */}
        <div className="bg-[#d6ba73] p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-extrabold mb-4">Net Salary</h2>

            <p className="text-5xl font-extrabold text-[#4a2c16]">
              ₱{stats.netSalary.toFixed(2)}
            </p>

            <p className="mt-4 text-md font-semibold">
              Next Pay Date:{" "}
              <span className="font-bold">{getNextPayDate()}</span>
            </p>
          </div>

          {/* Salary Details */}
          <div className="mt-6 space-y-2 text-sm font-semibold">
            <p>Daily Rate: ₱{DAILY_RATE.toFixed(2)}</p>
            <p>Late Penalty / Hour: ₱{LATE_PENALTY_PER_HOUR.toFixed(2)}</p>
          </div>
        </div>

        {/* RIGHT SIDE – USER INFO */}
        <div className="bg-[#4a2c16] text-white p-8 grid gap-6">
          <div>
            <p className="text-sm opacity-80">Name</p>
            <p className="text-2xl font-extrabold">{userName}</p>
          </div>

          <div>
            <p className="text-sm opacity-80">Email</p>
            <p className="font-bold underline">{userEmail}</p>
          </div>

          {dateStarted && (
            <div>
              <p className="text-sm opacity-80">Date Started</p>
              <p className="font-bold">
                {moment(dateStarted).format("MMMM DD, YYYY")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#a66a30] p-4 rounded-lg shadow-md">
          <p className="text-white text-sm">Days Present</p>
          <p className="text-xl font-extrabold text-white">
            {stats.present} day/s
          </p>
        </div>
        <div className="bg-[#a66a30] p-4 rounded-lg shadow-md">
          <p className="text-white text-sm">Days Absent</p>
          <p className="text-xl font-extrabold text-white">
            {stats.absent} day/s
          </p>
        </div>
        <div className="bg-[#a66a30] p-4 rounded-lg shadow-md">
          <p className="text-white text-sm">Late Hours</p>
          <p className="text-xl font-extrabold text-white">
            {stats.lateHours} hour/s
          </p>
        </div>
        <div className="bg-[#a66a30] p-4 rounded-lg shadow-md">
          <p className="text-white text-sm">Hours Worked</p>
          <p className="text-xl font-extrabold text-white">
            {stats.hoursWorked} hour/s
          </p>
        </div>
        <div className="bg-[#a66a30] p-4 rounded-lg shadow-md">
          <p className="text-white text-sm">Late Hour Deductions</p>
          <p className="text-xl font-extrabold text-white">
            ₱{stats.lateDeduction}
          </p>
        </div>
      </div>
    </div>
  );
}
