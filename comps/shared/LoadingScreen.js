import layout from "./../../styles/layout.module.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

const LoadingScreen = () => {
  return (
    <div className={layout.container}>
      <main className={layout.main}>
        <CircularProgress size={64} />
        <Typography variant={"h1"} color={"primary"} align={"center"}>
          Loading
        </Typography>
      </main>
    </div>
  );
};

export default LoadingScreen;
