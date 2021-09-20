import Head from "next/head";
import styles from "../styles/Home.module.css";
import layout from "../styles/layout.module.css";
import voting from "./../img/voting.svg";
import Typography from "@material-ui/core/Typography";
import React, { useContext } from "react";
import LoginButton from "../comps/auth/LoginButton";
import UserContext from "../comps/auth/UserContext";

export default function Home() {
  const user = useContext(UserContext);
  return (
    <div className={layout.container}>
      <Head>
        <title>Home | StuyBOE Voting Site</title>
        <meta property={"og:title"} content={"Home | StuyBOE Voting Site"} />
        <meta
          property={"og:image"}
          content={"https://vote.stuysu.org/logo512.png"}
        />
        <meta property={"og:image:height"} content={512} />
        <meta property={"og:image:width"} content={512} />
        <meta property={"og:image:alt"} content={"Board of Elections Logo"} />
        <meta property="og:image:type" content="image/png" />
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
          height={600}
          width={800}
        />
        {!user.signedIn && (
          <div className={layout.flexCenter}>
            <LoginButton />
          </div>
        )}
      </main>
    </div>
  );
}
