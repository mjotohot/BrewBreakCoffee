import { useEffect, useState } from "react";
import { getAllEmployees } from "../../services/employeeService";
import { getInitials, getAvatarColor } from "../../utils/getInitials";

export default function StaffList() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getAllEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees by search
  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 font-mono">
      {/* Staff Table */}
      <div className="bg-[#4a2204] rounded-xl p-5 overflow-x-auto">
        {/* Header & Search */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl text-white font-bold">List of All Staff</h1>
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded-md text-black bg-[#d6ba73] w-full max-w-xs"
          />
        </div>
        <table className="min-w-full text-white">
          <thead>
            <tr className="border-b border-gray-600 text-gray-600">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Date Joined</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp, index) => (
              <tr key={emp.id} className="border-b border-gray-700">
                <td className="px-4 py-3">
                  <span
                    style={{ backgroundColor: getAvatarColor(index) }}
                    className="w-12 h-12 rounded-full mr-2 p-2 text-white font-bold text-lg"
                  >
                    {getInitials(emp.name)}
                  </span>
                  {emp.name}
                </td>
                <td className="px-4 py-3">{emp.email}</td>
                <td className="px-4 py-3">{emp.role}</td>
                <td className="px-4 py-3">
                  {new Date(emp.created_at).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-2 text-center text-gray-400">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
