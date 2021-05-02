import React from "react";
import searching from "../../img/404-images/searching-with-dog.png";
import layout from "../../styles/layout.module.css";
import Typography from "@material-ui/core/Typography";
import Link from "next/link";
import Button from "@material-ui/core/Button";
import HowToVote from "@material-ui/icons/HowToVote";

const CandidateNotFound = ({ href, buttonLabel }) => {
  return (
    <>
      <img
        src={searching}
        className={layout.largeVector}
        alt={"Someone with a magnifying glass looking at the ground"}
      />
      <Typography variant={"h1"} align={"center"}>
        Candidate Not Found
      </Typography>
      <Link href={href}>
        <Button
          startIcon={<HowToVote />}
          color={"secondary"}
          variant={"contained"}
        >
          {buttonLabel}
        </Button>
      </Link>
    </>
  );
};

export default CandidateNotFound;
