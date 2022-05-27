import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import React from "react";
import gaEvent from "../../utils/analytics/gaEvent";
import ElectionCardDate from "./ElectionCardDate";

const styles = {
  media: {
    height: "200px",
  },
};

function ElectionCard({
  picture,
  name,
  start,
  end,
  href,
  dateUpdateInterval = 1000,
}) {
  return (
    <Card
      onClick={() =>
        gaEvent({
          category: "click",
          action: "election card click",
          label: name,
          nonInteraction: false,
        })
      }
    >
      <Link href={href} passHref>
        <CardActionArea>
          <CardMedia
            image={picture?.resource?.url}
            title={picture.alt}
            sx={styles.media}
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
}

export default ElectionCard;
