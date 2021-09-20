import CircularProgress from "@material-ui/core/CircularProgress";
import layout from "./../../styles/layout.module.css";

export default function CenteredCircularProgress() {
  return (
    <div className={layout.center}>
      <CircularProgress />
    </div>
  );
}
