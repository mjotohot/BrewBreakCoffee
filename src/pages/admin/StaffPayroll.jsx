import Cards from "../../components/commons/Cards";
import { FaCircleCheck } from "react-icons/fa6";
import { FaTimesCircle } from "react-icons/fa";
import moment from "moment";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { employeesList } from "../../services/auth";
import { getMonthlyAttendance } from "../../services/attendanceService";

const DAILY_RATE = 500;
// Generate avatar colors
const avatarColors = [
  "#E91E63",
  "#9C27B0",
  "#2196F3",
  "#FF9800",
  "#4CAF50",
  "#F44336",
  "#00BCD4",
  "#FFC107",
];

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "??";
  const names = name
    .trim()
    .split(" ")
    .filter((n) => n.length > 0);
  if (names.length === 0) return "??";
  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase();
  }
  return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
};

const getAvatarColor = (index) => {
  return avatarColors[index % avatarColors.length];
};

const calculateAttendanceStats = (attendanceRecords) => {
  let present = 0;
  let absent = 0;
  let late = 0;

  if (!attendanceRecords || attendanceRecords.length === 0) {
    return { present: 0, absent: 0, late: 0 };
  }

  attendanceRecords.forEach((record) => {
    if (record.check_in && record.check_out) {
      const checkInTime = moment(record.check_in, "HH:mm:ss");
      const cutoffTime = moment("08:00:00", "HH:mm:ss");

      if (checkInTime.isAfter(cutoffTime)) {
        late++;
      }
      present++;
    } else if (!record.check_in && !record.check_out) {
      absent++;
    }
  });

  return { present, absent, late };
};

export default function StaffPayroll() {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    moment().format("YYYY-MM")
  );
  const [totalStaff, setTotalStaff] = useState(0);
  const [totalPayroll, setTotalPayroll] = useState(0);

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [employeesData, attendanceData] = await Promise.all([
        employeesList(),
        getMonthlyAttendance(selectedMonth),
      ]);

      const attendanceByUser = {};
      attendanceData.forEach((record) => {
        if (!attendanceByUser[record.user_id]) {
          attendanceByUser[record.user_id] = [];
        }
        attendanceByUser[record.user_id].push(record);
      });

      // Merge employee data with attendance data
      const mergedData = employeesData.map((employee) => {
        const userAttendance = attendanceByUser[employee.id] || [];
        const stats = calculateAttendanceStats(userAttendance);
        const salary = stats.present * DAILY_RATE;

        return {
          id: employee.id,
          name: employee.name || "Unknown",
          email: employee.email || "",
          salary: salary,
          present: stats.present,
          absent: stats.absent,
          late: stats.late,
        };
      });

      setEmployees(mergedData);
      setAttendanceData(attendanceData);
      setTotalStaff(employeesData.length);

      const payrollSum = mergedData.reduce((sum, emp) => sum + emp.salary, 0);
      setTotalPayroll(payrollSum.toFixed(2));
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load employee data");
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Month Selector */}
      <div className="mb-6 flex items-center gap-4">
        <label className="text-lg font-semibold">Select Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d6ba73]"
        />
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 tracking-widest mb-8">
        {[
          {
            id: 1,
            count: totalStaff.toString(),
            icon: FaCircleCheck,
            detail: "TOTAL STAFF",
          },
          {
            id: 2,
            count: `₱${totalPayroll}`,
            icon: FaTimesCircle,
            detail: "TOTAL PAYROLL",
          },
        ].map((c) => (
          <Cards key={c.id} count={c.count} detail={c.detail} icon={c.icon} />
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Loading employee data...</p>
        </div>
      )}

      {/* EMPLOYEE CARDS */}
      {!loading && employees.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {employees.map((employee, index) => (
            <div
              key={employee.id}
              className="bg-linear-to-br from-amber-700 to-amber-900 rounded-xl shadow-lg overflow-hidden"
            >
              {/* Header with Avatar and Salary */}
              <div className="bg-amber-800/50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: getAvatarColor(index) }}
                  >
                    {getInitials(employee.name)}
                  </div>
                  <span className="text-white font-semibold text-lg">
                    {employee.name}
                  </span>
                </div>
                <div className="bg-green-500 text-white px-3 py-1 rounded-lg font-bold text-sm">
                  ₱
                  {employee.salary.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-0">
                <div className="bg-amber-800 p-4 text-center border-r border-amber-700">
                  <p className="text-amber-200 text-xs mb-1">Present</p>
                  <p className="text-white text-2xl font-bold">
                    {employee.present}
                  </p>
                </div>
                <div className="bg-amber-800 p-4 text-center border-r border-amber-700">
                  <p className="text-amber-200 text-xs mb-1">Absent</p>
                  <p className="text-white text-2xl font-bold">
                    {employee.absent}
                  </p>
                </div>
                <div className="bg-amber-800 p-4 text-center">
                  <p className="text-amber-200 text-xs mb-1">Late</p>
                  <p className="text-white text-2xl font-bold">
                    {employee.late}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && employees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No employees found.</p>
        </div>
      )}
    </div>
  );
}
