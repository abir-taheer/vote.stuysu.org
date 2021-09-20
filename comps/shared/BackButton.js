import Button from "@material-ui/core/Button";
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";
import Link from "next/link";
import React from "react";

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
