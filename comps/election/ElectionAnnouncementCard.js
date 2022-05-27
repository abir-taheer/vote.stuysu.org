import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import React from "react";
import useFormatDate from "../../utils/date/useFormatDate";

const styles = {
  card: {
    padding: "1rem",
  },
  hr: {
    opacity: "0.4",
  },
};

export default function ElectionAnnouncementCard({ title, updatedAt, body }) {
  const { getReadableDate } = useFormatDate(false);

  return (
    <Card sx={styles.card}>
      <Typography variant={"h3"}>{title}</Typography>
      <Typography variant={"subtitle2"} color={"secondary"}>
        {getReadableDate(updatedAt)}
      </Typography>

      <hr style={styles.hr} />

      <div
        className="sanitized-html"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </Card>
  );
}
