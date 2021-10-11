import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Link from "next/link";

const styles = {
  media: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
  },

  action: {
    paddingTop: "1.5rem",
  },

  mediaContainer: {
    textAlign: "center",
  },
};

function CandidateCard({ href, picture, blurb, name }) {
  return (
    <Card>
      <Link href={href}>
        <CardActionArea sx={styles.action}>
          <div style={styles.mediaContainer}>
            <img
              src={picture?.resource?.url}
              alt={picture?.alt}
              style={styles.media}
            />
          </div>
          <CardContent>
            <Typography gutterBottom variant="h3" align={"center"}>
              {name}
            </Typography>
            {/*Put the dates in a separate component because they re-render every second*/}
            <Typography variant={"body2"} color={"textSecondary"} gutterBottom>
              {blurb || "This candidate has not provided a blurb"}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}

export default CandidateCard;
