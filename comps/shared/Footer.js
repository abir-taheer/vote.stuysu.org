import React from "react";
import gaEvent from "../../utils/analytics/gaEvent";

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
        <a
          href={"https://abir.nyc?utm_referrer=vote.stuysu.org"}
          target={"_blank"}
          onClick={() =>
            gaEvent({
              category: "click",
              action: "Clicked on Footer (Abir Taheer)",
              label: "Abir Taheer",
              nonInteraction: false,
            })
          }
        >
          Abir Taheer
        </a>
      </p>
    </footer>
  );
}

export default Footer;
