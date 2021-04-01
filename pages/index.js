import Head from "next/head";
import styles from "../styles/Home.module.css";
import layout from "../styles/layout.module.css";
import voting from "./../img/voting.svg";
import Typography from "@material-ui/core/Typography";

export default function Home() {
  return (
    <div className={layout.container}>
      <Head>
        <title>Home | StuyBOE Voting Site</title>
      </Head>

      <main className={layout.main}>
        <Typography variant={"h1"} align={"center"} className={styles.title}>
          <span className={styles.purpleTextGradient}>
            Make your voice heard
          </span>{" "}
          📢
        </Typography>

        <Typography variant={"subtitle1"} className={styles.description}>
          "There's no such thing as a vote that doesn't matter."
        </Typography>

        <img
          src={voting}
          alt={"People representing voting"}
          className={layout.largeVector}
        />
      </main>
    </div>
  );
}
