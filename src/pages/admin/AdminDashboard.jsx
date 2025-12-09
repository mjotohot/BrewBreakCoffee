import { useEffect, useState } from "react";
import Cards from "../../components/commons/Cards";
import { FaCircleCheck } from "react-icons/fa6";
import { getAllEmployees } from "../../services/employeeService";
import { getAttendanceToday } from "../../services/attendanceService";
import { getInitials, getAvatarColor } from "../../utils/getInitials";

export default function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [stats, setStats] = useState({
    totalStaff: 0,
    present: 0,
    absent: 0,
    late: 0,
  });

  const [attendanceList, setAttendanceList] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      // const today = new Date().toISOString().split("T")[0];

      const employeesData = await getAllEmployees();
      const attendanceData = await getAttendanceToday(selectedDate);

      setEmployees(employeesData);
      setAttendanceList(attendanceData);

      const presentCount = attendanceData.length;
      const totalStaff = employeesData.length;
      const absentCount = totalStaff - presentCount;
      const lateCount = attendanceData.filter(
        (a) => a.check_in > "08:00:00"
      ).length;

      setStats({
        totalStaff,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
      });
    };

    fetchDashboard();
  }, [selectedDate]);

  const cards = [
    {
      title: "Total Staff",
      value: stats.totalStaff,
      color: "bg-blue-600",
      icon: FaCircleCheck,
    },
    {
      title: "Present Today",
      value: stats.present,
      color: "bg-green-600",
      icon: FaCircleCheck,
    },
    {
      title: "Absent Today",
      value: stats.absent,
      color: "bg-red-600",
      icon: FaCircleCheck,
    },
    {
      title: "Late Today",
      value: stats.late,
      color: "bg-yellow-600",
      icon: FaCircleCheck,
    },
  ];

  // Build a list of all employees with today's attendance status
  const todayAttendanceList = employees.map((emp) => {
    const record = attendanceList.find((a) => a.user_id === emp.id);
    let status = "Absent";

    if (record) {
      status = "Present";
      if (record.check_in > "08:00:00") {
        status += " (Late)";
      }
    }

    return {
      id: emp.id,
      name: emp.name,
      check_in: record?.check_in || "-",
      check_out: record?.check_out || "-",
      status,
    };
  });

  // filtered list
  const filteredAttendance = todayAttendanceList.filter((item) => {
    const matchesName = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ? true : item.status === statusFilter;
    return matchesName && matchesStatus;
  });

  return (
    <div className="space-y-6 font-mono">
      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 tracking-widest">
        {cards.map((c) => (
          <Cards key={c.title} count={c.value} detail={c.title} icon={c.icon} />
        ))}
      </div>

      {/* ATTENDANCE TABLE */}
      <div className="bg-[#4a2204] rounded-xl p-5 overflow-x-auto">
        <div className="flex justify-between mb-5">
          <h1 className="text-xl text-white font-bold">Daily Attendance</h1>
          <div className="flex gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 rounded-md text-black bg-[#d6ba73]"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 py-2 rounded-md text-black bg-[#d6ba73]"
            >
              <option>All</option>
              <option>Present</option>
              <option>Present (Late)</option>
              <option>Absent</option>
            </select>
            <input
              type="text"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 rounded-md text-black bg-[#d6ba73] flex-1"
            />
          </div>
        </div>
        <table className="min-w-full text-white">
          <thead>
            <tr className="border-b border-gray-600 text-gray-600">
              <th className="px-4 py-2 text-left">Staff Name</th>
              <th className="px-4 py-2 text-left">Check-in</th>
              <th className="px-4 py-2 text-left">Check-out</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-700">
                <td className="px-4 py-3">
                  <span
                    style={{ backgroundColor: getAvatarColor(index) }}
                    className="w-12 h-12 rounded-full mr-2 p-2 text-white font-bold text-lg"
                  >
                    {getInitials(item.name)}
                  </span>
                  {item.name}
                </td>
                <td className="px-4 py-3">{item.check_in}</td>
                <td className="px-4 py-3">{item.check_out}</td>
                <td
                  className={`px-4 py-3 font-semibold ${
                    item.status.startsWith("Absent")
                      ? "text-red-500"
                      : item.status.includes("Late")
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
