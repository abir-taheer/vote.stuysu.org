import CircularProgress from "@mui/material/CircularProgress";
import { useEffect } from "react";
import gaEvent from "../../utils/analytics/gaEvent";
import layout from "./../../styles/layout.module.css";

export default function CenteredCircularProgress() {
  useEffect(() => {
    const start = new Date();

    return () => {
      const end = new Date();
      const time = end.getTime() - start.getTime();
      const seconds = Math.round((time * 10) / 1000) / 10;

      gaEvent({
        category: "loading",
        action: "centered circular progress",
        label: seconds + "s",
        nonInteraction: true,
      });
    };
  }, []);

  return (
    <div className={layout.center}>
      <CircularProgress />
    </div>
  );
}
