import moment from "moment";

export const DAILY_RATE = 435;
export const LATE_PENALTY_PER_HOUR = 54;
export const STANDARD_CHECKIN = "08:00:00";

/**
 * Calculates attendance and salary statistics for a given month.
 *
 * @param {Array} attendanceRecords - Attendance records for a user
 * @param {String} selectedMonth - Month in YYYY-MM format
 * @param {String|null} dateStarted - Employee's start date (optional)
 * @returns {Object} { present, absent, lateHours, hoursWorked, netSalary, lateDeduction }
 */

export const calculateAttendanceStats = (
  attendanceRecords,
  selectedMonth,
  dateStarted = null
) => {
  if (!attendanceRecords || attendanceRecords.length === 0) {
    return {
      present: 0,
      absent: 0,
      lateHours: 0,
      hoursWorked: 0,
      netSalary: 0,
      lateDeduction: 0,
    };
  }

  // Filter for selected month
  const monthRecords = attendanceRecords.filter(
    (r) => moment(r.date).format("YYYY-MM") === selectedMonth
  );

  // Days present
  const present = monthRecords.filter((r) => r.check_in).length;

  // Days absent
  const daysInMonth = moment(selectedMonth, "YYYY-MM").daysInMonth();
  let absent = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = moment(`${selectedMonth}-${day}`, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );
    const dateObj = moment(dateStr);

    if (dateObj.isAfter(moment(), "day")) continue;
    if (dateStarted && dateObj.isBefore(moment(dateStarted), "day")) continue;

    if (!monthRecords.some((r) => r.date === dateStr)) absent++;
  }

  // Late hours
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

  // Total hours worked
  let hoursWorked = 0;
  monthRecords.forEach((r) => {
    if (!r.check_in || !r.check_out) return;
    const start = moment(`${r.date} ${r.check_in}`);
    const end = moment(`${r.date} ${r.check_out}`);
    hoursWorked += Math.floor(end.diff(start, "hours", true));
  });

  // Salary
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
};
