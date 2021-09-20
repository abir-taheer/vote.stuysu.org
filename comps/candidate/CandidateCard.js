import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Link from "next/link";
import styles from "./CandidateCard.module.css";

const CandidateCard = ({ href, picture, blurb, name }) => {
  return (
    <Card>
      <Link href={href}>
        <CardActionArea className={styles.action}>
          <div className={styles.mediaContainer}>
            <img
              src={picture?.resource?.url}
              alt={picture?.alt}
              className={styles.media}
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
};

export default CandidateCard;
