import Head from "next/head";
import styles from "../styles/Home.module.css";
import voting from "./../img/voting.svg";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Home | StuyBOE Voting Site</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <span className={styles.purpleTextGradient}>Get your vote out</span>{" "}
          🗳️
        </h1>

        <p className={styles.description}>
          "There's no such thing as a vote that doesn't matter." <br />
          &mdash; Barack Obama
        </p>

        <img
          src={voting}
          alt={"People representing voting"}
          style={{ maxWidth: "90%", height: 400, objectFit: "contain" }}
        />
      </main>
    </div>
  );
}
