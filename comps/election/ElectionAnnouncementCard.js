import Typography from "@material-ui/core/Typography";
import { Card } from "@material-ui/core";
import React from "react";
import useFormatDate from "../../utils/date/useFormatDate";
import styles from "./ElectionAnnouncementCard.module.css";

export default function ElectionAnnouncementCard({ title, updatedAt, body }) {
  const { getReadableDate } = useFormatDate(false);

  return (
    <Card className={styles.card}>
      <Typography variant={"h3"}>{title}</Typography>
      <Typography
        variant={"subtitle2"}
        color={"secondary"}
        children={getReadableDate(updatedAt)}
      />

      <hr className={styles.hr} />

      <div
        className="sanitized-html"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </Card>
  );
}
