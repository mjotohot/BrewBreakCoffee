// Profile.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { getAttendanceByUser } from "../../services/attendanceService";
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

  const DAILY_RATE = 435;
  const LATE_PENALTY_PER_HOUR = 54;
  const STANDARD_CHECKIN = "08:00:00";

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

  // Calculate stats whenever attendance or selectedMonth changes
  const stats = useMemo(() => {
    if (attendance.length === 0) {
      return {
        present: 0,
        absent: 0,
        lateHours: 0,
        hoursWorked: 0,
        netSalary: 0,
      };
    }

    // Filter records for selected month
    const monthRecords = attendance.filter(
      (r) => moment(r.date).format("YYYY-MM") === selectedMonth
    );

    // Days present for selected month
    const present = monthRecords.filter((r) => r.check_in).length;

    // Days absent for selected month
    const daysInMonth = moment(selectedMonth, "YYYY-MM").daysInMonth();
    let absent = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = moment(`${selectedMonth}-${day}`, "YYYY-MM-DD").format(
        "YYYY-MM-DD"
      );
      const dateObj = moment(dateStr);

      // Skip future dates
      if (dateObj.isAfter(moment(), "day")) continue;

      // Skip dates before employee started (if we have dateStarted)
      if (dateStarted && dateObj.isBefore(moment(dateStarted), "day")) continue;

      // Count as absent if no record exists
      if (!monthRecords.some((r) => r.date === dateStr)) absent++;
    }

    // Total hours worked for selected month
    let hoursWorked = 0;
    monthRecords.forEach((r) => {
      if (!r.check_in || !r.check_out) return;
      const start = moment(`${r.date} ${r.check_in}`);
      const end = moment(`${r.date} ${r.check_out}`);
      hoursWorked += Math.floor(end.diff(start, "hours", true));
    });

    // Calculate late hours for selected month
    const lateHours = monthRecords.reduce((sum, r) => {
      if (!r.check_in) return sum;

      const standardTime = moment(
        `${r.date} ${STANDARD_CHECKIN}`,
        "YYYY-MM-DD HH:mm:ss"
      );
      const checkInTime = moment(
        `${r.date} ${r.check_in}`,
        "YYYY-MM-DD HH:mm:ss"
      );

      if (checkInTime.isAfter(standardTime)) {
        const diffHours = Math.floor(
          checkInTime.diff(standardTime, "hours", true)
        );
        return sum + diffHours;
      }
      return sum;
    }, 0);

    // Calculate net salary
    const grossSalary = present * DAILY_RATE;
    const lateDeduction = lateHours * LATE_PENALTY_PER_HOUR;
    const netSalary = Math.max(grossSalary - lateDeduction, 0);

    return {
      present,
      absent,
      lateHours,
      hoursWorked,
      netSalary: Number(netSalary.toFixed(2)),
      lateDeduction: Number(lateDeduction.toFixed(2)),
    };
  }, [
    attendance,
    selectedMonth,
    dateStarted,
    DAILY_RATE,
    LATE_PENALTY_PER_HOUR,
    STANDARD_CHECKIN,
  ]);

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
            className="px-4 py-2 border rounded-lg bg-[#d6ba73] shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
