import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
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

      </main>

      <footer className={styles.footer}>
        <p>
          Created by{" "}
          <a href={"https://github.com/abir-taheer"} target={"_blank"}>
            Abir Taheer
          </a>
        </p>
      </footer>
    </div>
  );
}
