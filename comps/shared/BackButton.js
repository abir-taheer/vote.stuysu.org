import React from "react";
import Link from "next/link";
import Button from "@material-ui/core/Button";
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";
import styles from "./BackButton.module.css";

const BackButton = ({
  text = "Back To Home",
  href = "/",
  color = "primary",
  variant = "outlined",
}) => {
  return (
    <div className={styles.container}>
      <Link href={href}>
        <Button color={color} variant={variant} startIcon={<ArrowBackIos />}>
          {text}
        </Button>
      </Link>
    </div>
  );
};

export default BackButton;
