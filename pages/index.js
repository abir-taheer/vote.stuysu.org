import Head from "next/head";
import styles from "../styles/Home.module.css";
import GoogleLoginButton from "../comps/auth/GoogleLoginButton";

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

        <GoogleLoginButton />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
