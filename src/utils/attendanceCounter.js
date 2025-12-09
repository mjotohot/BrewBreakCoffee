import moment from "moment";

// Count days present (current month)
export function getDaysPresent(records) {
  const month = moment().format("YYYY-MM");
  return records.filter(
    (r) => r.check_in && moment(r.date).format("YYYY-MM") === month
  ).length;
}

// Count days absent (current month)
export function getDaysAbsent(records) {
  const month = moment().format("YYYY-MM");
  const daysInMonth = moment(month, "YYYY-MM").daysInMonth();

  let absent = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = moment(`${month}-${day}`, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );
    if (moment(dateStr).isAfter(moment(), "day")) continue;
    if (!records.some((r) => r.date === dateStr)) absent++;
  }
  return absent;
}

// Total hours worked this month (whole hours only, no decimals)
export function getHoursWorkedThisMonth(records) {
  const month = moment().format("YYYY-MM");
  let total = 0;

  records.forEach((r) => {
    if (!r.check_in || !r.check_out) return;
    if (moment(r.date).format("YYYY-MM") !== month) return;

    const start = moment(`${r.date} ${r.check_in}`);
    const end = moment(`${r.date} ${r.check_out}`);
    total += Math.floor(end.diff(start, "hours", true));
  });

  return total;
}
