import layout from "./../../styles/layout.module.css";
import Typography from "@material-ui/core/Typography";

const ElectionIndex = () => {
  return (
    <div className={layout.container}>
      <main className={layout.main}>
        <Typography variant={"h1"}>Elections</Typography>
      </main>
    </div>
  );
};

export default ElectionIndex;
