import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";

const styles = {
  action: {
    paddingTop: "1.5rem",
  },

  mediaContainer: {
    textAlign: "center",
  },

  secondaryText: {
    overflowWrap: "break-word",
  },
  primaryText: {
    overflowWrap: "break-word",
  },
};

function CandidateCard({ href, picture, blurb, name, strikes }) {
  return (
    <Card>
      <Link href={href} passHref>
        <CardActionArea sx={styles.action}>
          <div style={styles.mediaContainer}>
            <Image
              src={picture?.resource?.url}
              alt={picture?.alt}
              objectFit={"cover"}
              height={150}
              width={150}
              className={"crop-circle"}
            />
          </div>
          <CardContent>
            <Typography
              gutterBottom
              variant="h3"
              align={"center"}
              sx={styles.primaryText}
            >
              {name}
            </Typography>
            {!!strikes && (
              <Typography
                variant={"body2"}
                color={"error"}
                gutterBottom
                align={"center"}
              >
                {strikes} Strike{strikes === 1 ? "" : "s"}
              </Typography>
            )}
            {/*Put the dates in a separate component because they re-render every second*/}
            <Typography
              variant={"body2"}
              color={"textSecondary"}
              gutterBottom
              sx={styles.secondaryText}
            >
              {blurb || "This candidate has not provided a blurb"}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}

export default CandidateCard;
