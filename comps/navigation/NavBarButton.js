import Button from "@mui/material/Button";
import Link from "next/link";
import gaEvent from "../../utils/analytics/gaEvent";

export default function NavBarButton({ label, active, href }) {
  return (
    <Link href={href} passHref>
      <Button
        disableRipple
        sx={{
          color: active ? "primary" : "black",
        }}
        onClick={() => {
          gaEvent({
            category: "click",
            action: "navbar button click",
            label,
            nonInteraction: false,
          });
        }}
      >
        {label}
      </Button>
    </Link>
  );
}
