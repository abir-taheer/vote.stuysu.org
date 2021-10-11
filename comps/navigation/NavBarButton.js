import Button from "@mui/material/Button";
import Link from "next/link";

export default function NavBarButton({ label, active, href }) {
  return (
    <Link href={href} passHref>
      <Button
        disableRipple
        sx={{
          color: active ? "primary" : "black",
        }}
      >
        {label}
      </Button>
    </Link>
  );
}
