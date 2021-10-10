import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import Button from "@mui/material/Button";
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
      <Button
        color={color}
        variant={variant}
        startIcon={<ArrowBackIos />}
        sx={{ marginBottom: "2rem" }}
      >
        {text}
      </Button>
    </Link>
  );
};

export default BackButton;
