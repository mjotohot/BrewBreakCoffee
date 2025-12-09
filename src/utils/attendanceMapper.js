import moment from "moment";

export const mapAttendanceToEvents = (records) => {
  return records.flatMap((record) => {
    const date = record.date;

    const events = [
      {
        id: `in-${record.id}`,
        title: `${moment(record.check_in, "HH:mm:ss").format("hh:mm A")} (In)`,
        start: moment(`${date} ${record.check_in}`).toDate(),
        end: moment(`${date} ${record.check_in}`).toDate(),
        type: "in",
      },
    ];

    if (record.check_out) {
      events.push({
        id: `out-${record.id}`,
        title: `${moment(record.check_out, "HH:mm:ss").format(
          "hh:mm A"
        )} (Out)`,
        start: moment(`${date} ${record.check_out}`).toDate(),
        end: moment(`${date} ${record.check_out}`).toDate(),
        type: "out",
      });
    }

    return events;
  });
};
