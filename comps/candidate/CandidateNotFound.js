import HowToVote from "@mui/icons-material/HowToVote";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import React from "react";
import searching from "../../img/404-images/searching-with-dog.png";
import layout from "../../styles/layout.module.css";

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
      <Link href={href} passHref>
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
