import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { toast } from "react-hot-toast";
import moment from "moment";
import {
  getLeavesByEmployee,
  submitLeave,
} from "../../services/fileLeaveService";

export default function FileLeave() {
  const userId = useAuthStore((state) => state.id);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
    status: "Pending",
  });

  useEffect(() => {
    if (!userId) return;
    const fetchLeaves = async () => {
      try {
        const data = await getLeavesByEmployee(userId);
        setLeaves(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, [userId]);

  const handleSubmit = async () => {
    try {
      const payload = {
        user_id: String(userId),
        ...form,
      };
      const created = await submitLeave(payload);
      setLeaves((prev) => [created, ...prev]);
      toast.success("Leave request submitted!");
      setForm({
        leave_type: "",
        start_date: "",
        end_date: "",
        reason: "",
        status: "Pending",
      });
    } catch (err) {
      console.error("Leave request failed:", err);
      toast.error("Failed to submit leave request.");
    }
  };

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-500",
    Approved: "bg-green-100 text-green-500",
    Rejected: "bg-red-100 text-red-500",
  };

  return (
    <div className="font-mono">
      <h1 className="w-full text-white font-extrabold text-xl text-center mb-5 border-b border-white pb-2">
        Submit and Manage your Leave Requests
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Submit Form */}
        <div className="bg-[#d6ba73] p-6 rounded-lg shadow-md lg:w-1/3">
          <h2 className="font-bold text-lg mb-4 text-gray-800">
            Submit a Leave Request
          </h2>

          {/* Leave Type */}
          <label className="block mb-1 font-semibold text-white">
            Leave Type
          </label>
          <select
            value={form.leave_type}
            onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
            className="w-full mb-3 px-3 py-2 bg-[#a66a30] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="" disabled>
              Select Leave Type
            </option>
            <option value="Vacation Leave">Vacation Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Family Leave">Family Leave</option>
            <option value="Maternity Leave">Maternity Leave</option>
            <option value="Personal Leave">Personal Leave</option>
          </select>

          {/* Start & End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block mb-1 font-semibold text-white">
                Start Date
              </label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) =>
                  setForm({ ...form, start_date: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#a66a30] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-white">
                End Date
              </label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="w-full px-3 py-2 bg-[#a66a30] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          {/* Reason */}
          <label className="block mb-1 font-semibold text-white">Reason</label>
          <textarea
            placeholder="Enter your reason here..."
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            className="w-full px-3 py-2 bg-[#a66a30] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4 resize-none"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-[#4a2204] cursor-pointer text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Submit Leave
          </button>
        </div>

        {/* Leave Requests List */}
        <div className="p-5 bg-[#4a2204] w-full max-w-3xl rounded-lg">
          <div className="h-[70vh] overflow-y-auto">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : leaves.length === 0 ? (
              <p className="text-center text-gray-500 italic">
                No leave requests yet.
              </p>
            ) : (
              <div className="space-y-4">
                {leaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="p-4 bg-[#a66a30] rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center"
                  >
                    <div className="mb-2 sm:mb-0">
                      <p className="font-bold text-white text-lg">
                        {leave.leave_type}
                      </p>
                      <p className="text-white">
                        {moment(leave.start_date).format("MMM DD, YYYY")} -{" "}
                        {moment(leave.end_date).format("MMM DD, YYYY")}
                      </p>
                      <p className="text-white mt-1">Reason: {leave.reason}</p>
                    </div>
                    <span
                      className={`mt-2 sm:mt-0 px-3 py-1 rounded-full font-semibold ${
                        statusColors[leave.status] ||
                        "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
