import React from "react";
import searching from "../../img/404-images/searching-with-dog.png";
import layout from "../../styles/layout.module.css";
import Typography from "@material-ui/core/Typography";
import Link from "next/link";
import Button from "@material-ui/core/Button";
import People from "@material-ui/icons/People";

const UserNotFound = ({ href, buttonLabel }) => {
  return (
    <>
      <img
        src={searching}
        className={layout.largeVector}
        alt={"Someone with a magnifying glass looking at the ground"}
      />
      <Typography variant={"h1"} align={"center"}>
        User Not Found
      </Typography>
      <Link href={href}>
        <Button
          startIcon={<People />}
          color={"secondary"}
          variant={"contained"}
        >
          {buttonLabel}
        </Button>
      </Link>
    </>
  );
};

export default UserNotFound;
