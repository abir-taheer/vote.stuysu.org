import HowToVote from "@mui/icons-material/HowToVote";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import searching from "../../img/404-images/searching-with-dog.png";
import layout from "../../styles/layout.module.css";

const ElectionNotFound = ({ href }) => {
  return (
    <div className={layout.centerContainer}>
      <Image
        src={searching}
        height={304}
        width={400}
        className={layout.largeVector}
        alt={"Someone with a magnifying glass looking at the ground"}
      />
      <Typography variant={"h1"} align={"center"}>
        Election Not Found
      </Typography>
      <Link href={href} passHref>
        <Button
          startIcon={<HowToVote />}
          color={"secondary"}
          variant={"contained"}
        >
          Back To Elections
        </Button>
      </Link>
    </div>
  );
};

export default ElectionNotFound;
