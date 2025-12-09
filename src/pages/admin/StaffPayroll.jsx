import Cards from "../../components/commons/Cards";
import { FaCircleCheck } from "react-icons/fa6";
import { FaTimesCircle } from "react-icons/fa";
import moment from "moment";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { employeesList } from "../../services/auth";
import { getMonthlyAttendance } from "../../services/attendanceService";
import { getInitials, getAvatarColor } from "../../utils/getInitials";
import { calculateAttendanceStats } from "../../utils/salaryCounter";

export default function StaffPayroll() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    moment().format("YYYY-MM")
  );
  const [totalStaff, setTotalStaff] = useState(0);
  const [totalPayroll, setTotalPayroll] = useState(0);

  useEffect(() => {
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

        const mergedData = employeesData.map((employee) => {
          const userAttendance = attendanceByUser[employee.id] || [];
          const stats = calculateAttendanceStats(
            userAttendance,
            selectedMonth,
            employee.date_started
          );

          return {
            id: employee.id,
            name: employee.name || "Unknown",
            email: employee.email || "",
            salary: stats.netSalary,
            present: stats.present,
            absent: stats.absent,
            lateHours: stats.lateHours,
            lateDeduction: stats.lateDeduction,
          };
        });

        setEmployees(mergedData);
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

    fetchData();
  }, [selectedMonth]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="min-h-screen font-mono">
      <div className="flex justify-between items-center mb-5 border-b border-white">
        <h1 className="w-full text-white font-extrabold text-xl pb-2">
          Manage Staff's Payrolls
        </h1>

        {/* Month Selector */}
        <div className="mb-1 flex items-center gap-4">
          <label className="text-lg text-white font-semibold">Month:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="px-4 py-2 border bg-[#d6ba73] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d6ba73]"
          />
        </div>
      </div>

      {/* Summary Cards */}
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

      {/* Employee Payroll Cards */}
      {!loading && employees.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          {employees.map((employee, index) => (
            <div
              key={employee.id}
              className="bg-[#d6ba73] rounded-xl shadow-lg overflow-hidden"
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
                <div className="bg-green-200 text-green-500 px-3 py-1 rounded-lg font-bold text-sm">
                  ₱
                  {employee.salary.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-0">
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
                <div className="bg-amber-800 p-4 text-center border-r border-amber-700">
                  <p className="text-amber-200 text-xs mb-1">Late Hrs</p>
                  <p className="text-white text-2xl font-bold">
                    {employee.lateHours}
                  </p>
                </div>
                <div className="bg-amber-800 p-4 text-center">
                  <p className="text-amber-200 text-xs mb-1">Deduction</p>
                  <p className="text-white text-xl font-bold">
                    ₱{employee.lateDeduction || "0"}
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
