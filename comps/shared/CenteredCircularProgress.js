import layout from "./../../styles/layout.module.css";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function CenteredCircularProgress() {
  return (
    <div className={layout.center}>
      <CircularProgress />
    </div>
  );
}
