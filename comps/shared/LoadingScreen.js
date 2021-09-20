import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import layout from "./../../styles/layout.module.css";

export default function LoadingScreen() {
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
