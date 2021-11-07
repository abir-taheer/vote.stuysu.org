import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import gaEvent from "../../utils/analytics/gaEvent";
import layout from "./../../styles/layout.module.css";

export default function LoadingScreen() {
  useEffect(() => {
    const start = new Date();

    return () => {
      const end = new Date();
      const time = end.getTime() - start.getTime();
      const seconds = Math.round((time * 10) / 1000) / 10;

      gaEvent({
        category: "loading",
        action: "loading screen",
        label: seconds + "s",
        nonInteraction: true,
      });
    };
  }, []);

  return (
    <Container maxWidth={"sm"} className={layout.page}>
      <div className={layout.center}>
        <CircularProgress size={64} />
      </div>

      <Typography variant={"h1"} color={"primary"} align={"center"}>
        Loading
      </Typography>
    </Container>
  );
}
