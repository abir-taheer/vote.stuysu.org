import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import Image from "next/image";
import React, { useContext } from "react";
import LoginButton from "../comps/auth/LoginButton";
import UserContext from "../comps/auth/UserContext";
import styles from "../styles/Home.module.css";
import layout from "../styles/layout.module.css";
import voting from "./../img/voting.svg";

export default function Home() {
  const user = useContext(UserContext);
  return (
    <Container maxWidth={"md"} className={layout.page}>
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

      <Typography
        variant={"h1"}
        align={"center"}
        className={styles.title}
        sx={{ margin: 0, lineHeight: 1.15, fontSize: "4rem" }}
      >
        <span className={styles.purpleTextGradient}>Make your voice heard</span>{" "}
        📢
      </Typography>

      <Typography variant={"subtitle1"} className={styles.description}>
        &quot;There&apos;s no such thing as a vote that doesn&apos;t
        matter.&quot;
      </Typography>

      <div className={layout.center}>
        <Image
          src={voting}
          alt={"People representing voting"}
          className={layout.largeVector}
          height={300}
          width={300}
          objectFit={"contain"}
        />
      </div>

      {!user.signedIn && (
        <div className={layout.center}>
          <LoginButton />
        </div>
      )}
    </Container>
  );
}
