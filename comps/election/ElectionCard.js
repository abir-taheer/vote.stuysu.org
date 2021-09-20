import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Link from "next/link";
import React from "react";
import styles from "./ElectionCard.module.css";
import ElectionCardDate from "./ElectionCardDate";

const ElectionCard = ({
  picture,
  name,
  start,
  end,
  href,
  dateUpdateInterval = 1000,
}) => {
  return (
    <Card>
      <Link href={href}>
        <CardActionArea>
          <CardMedia
            image={picture?.resource?.url}
            title={picture.alt}
            className={styles.media}
          />
          <CardContent>
            <Typography gutterBottom variant="h2">
              {name}
            </Typography>
            {/*Put the dates in a separate component because they re-render every second*/}
            <ElectionCardDate
              start={start}
              end={end}
              dateUpdateInterval={dateUpdateInterval}
            />
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default ElectionCard;
