import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import Button from "@mui/material/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import gaEvent from "../../utils/analytics/gaEvent";

const BackButton = ({
  text = "Back To Home",
  href = "/",
  color = "primary",
  variant = "outlined",
}) => {
  const router = useRouter();

  const { backPath, backLabel } = router.query || {}; // Empty object in case query undefined

  return (
    <Link href={backPath || href} passHref>
      <Button
        color={color}
        variant={variant}
        startIcon={<ArrowBackIos />}
        sx={{ marginBottom: "2rem" }}
        onClick={() => {
          gaEvent({
            category: "click",
            action: "back button",
            label: text,
            nonInteraction: false,
          });
        }}
      >
        {backLabel || text}
      </Button>
    </Link>
  );
};

export default BackButton;
