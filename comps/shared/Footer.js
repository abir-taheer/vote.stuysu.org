import React from "react";

const styles = {
  footer: {
    width: "100%",
    height: "100px",
    borderTop: "1px solid #eaeaea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

function Footer() {
  return (
    <footer style={styles.footer}>
      <p>
        Created by{" "}
        <a href={"https://abir.nyc"} target={"_blank"}>
          Abir Taheer
        </a>
      </p>
    </footer>
  );
}

export default Footer;
