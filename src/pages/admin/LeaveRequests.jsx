import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getAllLeaves, updateLeaveStatus } from "../../services/requestService";
import { getAllEmployees } from "../../services/employeeService";
import { getInitials, getAvatarColor } from "../../utils/getInitials";
import moment from "moment";

export default function AdminLeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending"); // Pending or History

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leavesData, employeesData] = await Promise.all([
          getAllLeaves(),
          getAllEmployees(),
        ]);
        setLeaves(leavesData);
        setEmployees(employeesData); // <-- use this for mapping names
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      const updated = await updateLeaveStatus(leaveId, { status: newStatus });
      setLeaves((prev) =>
        prev.map((l) =>
          l.id === leaveId ? { ...l, status: updated.status } : l
        )
      );
      toast.success(`Leave ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-500",
    Approved: "bg-green-100 text-green-500",
    Rejected: "bg-red-100 text-red-500",
  };

  // Filter leaves based on active tab
  const displayedLeaves = leaves.filter((leave) =>
    activeTab === "Pending"
      ? leave.status === "Pending"
      : leave.status !== "Pending"
  );

  return (
    <div className="space-y-6 font-mono">
      {/* Tabs */}
      <div className="flex gap-3 mb-5">
        {["Pending", "History"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md font-semibold ${
              activeTab === tab
                ? "bg-[#d6ba73] text-black"
                : "bg-[#4a2204] text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-[#4a2204] rounded-xl p-5 overflow-x-auto">
        <h1 className="text-xl text-white font-bold mb-5">
          List of All Requests and History
        </h1>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : displayedLeaves.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No {activeTab.toLowerCase()} leave requests.
          </p>
        ) : (
          <table className="min-w-full text-white">
            <thead>
              <tr className="border-b border-gray-600 text-gray-600">
                <th className="px-4 py-2 text-left">Employee</th>
                <th className="px-4 py-2 text-left">Leave Type</th>
                <th className="px-4 py-2 text-left">Start Date</th>
                <th className="px-4 py-2 text-left">End Date</th>
                <th className="px-4 py-2 text-left">Reason</th>
                <th className="px-4 py-2 text-left">Status</th>
                {activeTab === "Pending" && (
                  <th className="px-4 py-2 text-left">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {displayedLeaves.map((leave, index) => {
                const employee = employees.find((e) => e.id === leave.user_id);
                return (
                  <tr key={leave.id} className="border-b border-gray-700">
                    <td className="px-4 py-3">
                      <span
                        style={{ backgroundColor: getAvatarColor(index) }}
                        className="w-12 h-12 rounded-full mr-2 p-2 text-white font-bold text-lg"
                      >
                        {getInitials(employee?.name)}
                      </span>
                      {employee?.name}
                    </td>
                    <td className="px-4 py-2">{leave.leave_type}</td>
                    <td className="px-4 py-2">
                      {moment(leave.start_date).format("MMM DD, YYYY")}
                    </td>
                    <td className="px-4 py-2">
                      {moment(leave.end_date).format("MMM DD, YYYY")}
                    </td>
                    <td className="px-4 py-2">{leave.reason}</td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        statusColors[leave.status] ||
                        "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {leave.status}
                    </td>
                    {activeTab === "Pending" && (
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          onClick={() =>
                            handleStatusChange(leave.id, "Approved")
                          }
                          className="px-2 py-1 rounded-md bg-green-200 text-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(leave.id, "Rejected")
                          }
                          className="px-2 py-1 rounded-md bg-red-400 text-white"
                        >
                          Reject
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
