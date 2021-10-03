import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        Created by{" "}
        <a href={"https://abir.nyc"} target={"_blank"}>
          Abir Taheer
        </a>
      </p>
    </footer>
  );
};

export default Footer;
