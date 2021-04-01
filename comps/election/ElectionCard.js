import React from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";
import Link from "next/link";

import styles from "./ElectionCard.module.css";
import useReadableDate from "../../utils/date/useReadableDate";

const ElectionCard = ({ picture, name, start, end, href }) => {
  const readableDate = useReadableDate(true);

  return (
    <Card>
      <Link href={href}>
        <CardActionArea>
          <CardMedia
            image={picture.resource.url}
            title={picture.alt}
            className={styles.media}
          />
          <CardContent>
            <Typography gutterBottom variant="h2">
              {name}
            </Typography>
            <Typography variant={"body2"} color={"secondary"}>
              Starts: {readableDate(start)}
            </Typography>
            <Typography variant={"body2"} color={"primary"}>
              Ends: {readableDate(end)}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default ElectionCard;
