import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import Button from "@mui/material/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const BackButton = ({
  text = "Back To Home",
  href = "/",
  color = "primary",
  variant = "outlined",
}) => {
  const router = useRouter();

  const { backPath, backLabel } = router.query;

  return (
    <Link href={backPath || href} passHref>
      <Button
        color={color}
        variant={variant}
        startIcon={<ArrowBackIos />}
        sx={{ marginBottom: "2rem" }}
      >
        {backLabel || text}
      </Button>
    </Link>
  );
};

export default BackButton;
