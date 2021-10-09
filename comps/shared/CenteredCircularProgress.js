import CircularProgress from "@mui/material/CircularProgress";
import layout from "./../../styles/layout.module.css";

export default function CenteredCircularProgress() {
  return (
    <div className={layout.center}>
      <CircularProgress />
    </div>
  );
}
