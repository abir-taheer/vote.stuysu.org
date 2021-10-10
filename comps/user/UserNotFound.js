import People from "@mui/icons-material/People";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import searching from "../../img/404-images/searching-with-dog.png";
import layout from "../../styles/layout.module.css";

const UserNotFound = ({ href, buttonLabel }) => {
  return (
    <>
      <Image
        src={searching}
        className={layout.largeVector}
        alt={"Someone with a magnifying glass looking at the ground"}
      />
      <Typography variant={"h1"} align={"center"}>
        User Not Found
      </Typography>
      <div className={layout.center}>
        <Link href={href} passHref>
          <Button
            startIcon={<People />}
            color={"secondary"}
            variant={"contained"}
          >
            {buttonLabel}
          </Button>
        </Link>
      </div>
    </>
  );
};

export default UserNotFound;
