import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";
import { useEffect } from "react";
import gaEvent from "../../utils/analytics/gaEvent";
import layout from "./../../styles/layout.module.css";

export default function CenteredCircularProgress() {
  const router = useRouter();
  useEffect(() => {
    const start = new Date();

    return () => {
      const end = new Date();
      const time = end.getTime() - start.getTime();
      const seconds = Math.round((time * 10) / 1000) / 10;

      gaEvent({
        category: "loading",
        action: "centered loader " + router.asPath,
        label: seconds + "s",
        nonInteraction: true,
      });
    };
  }, [router]);

  return (
    <div className={layout.center}>
      <CircularProgress />
    </div>
  );
}
