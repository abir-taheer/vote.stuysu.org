import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
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
