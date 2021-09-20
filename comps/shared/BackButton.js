import React from "react";
import Link from "next/link";
import Button from "@material-ui/core/Button";
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";

const BackButton = ({
  text = "Back To Home",
  href = "/",
  color = "primary",
  variant = "outlined",
}) => {
  return (
    <Link href={href} passHref>
      <Button color={color} variant={variant} startIcon={<ArrowBackIos />}>
        {text}
      </Button>
    </Link>
  );
};

export default BackButton;
