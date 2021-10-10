import Typography from "@mui/material/Typography";
import useFormatDate from "../../utils/date/useFormatDate";

const ElectionCardDate = ({ start, end, dateUpdateInterval }) => {
  const { getReadableDate, now } = useFormatDate(
    Boolean(dateUpdateInterval),
    dateUpdateInterval
  );

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (now < startDate) {
    return (
      <Typography variant={"body2"} color={"secondary"}>
        {startDate > now ? "Starts" : "Started"} {getReadableDate(start)}
      </Typography>
    );
  }

  return (
    <Typography variant={"body2"} color={"secondary"}>
      {endDate > now ? "Ends" : "Ended"} {getReadableDate(end)}
    </Typography>
  );
};

export default ElectionCardDate;
