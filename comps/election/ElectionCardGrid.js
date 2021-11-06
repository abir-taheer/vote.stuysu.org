import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import searching from "./../../img/searching.svg";
import layout from "./../../styles/layout.module.css";
import ElectionCard from "./ElectionCard";

const styles = {
  grid: {
    margin: "1rem 0",
  },

  itemContainer: {
    margin: "0.5rem",
  },

  notFoundContainer: {
    textAlign: "center",
    color: "rgba(0, 0, 0, 0.6)",
    fontWeight: "bold",
  },

  notFoundImage: {
    opacity: 0.8,
    maxWidth: "300px",
  },

  container: {
    marginTop: "20px",
  },
};

function ElectionCardGrid({ page, results, numPages, onPageChange, admin }) {
  if (!numPages) {
    return (
      <div style={styles.notFoundContainer}>
        <Image
          src={searching}
          alt={"Someone with a magnifying glass pointed at the ground"}
          height={180}
          width={250}
        />
        <Typography paragraph>
          There are no elections that match the given criteria
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Grid container sx={styles.grid} justifyContent={"center"}>
        {results?.map(({ name, url, picture, id, start, end }) => (
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={id}>
            <div style={styles.itemContainer}>
              <ElectionCard
                name={name}
                picture={picture}
                start={start}
                end={end}
                href={admin ? "/admin/election/" + id : "/election/" + url}
              />
            </div>
          </Grid>
        ))}
      </Grid>

      {!!numPages && numPages > 1 && (
        <div className={layout.center}>
          <Pagination count={numPages} page={page} onChange={onPageChange} />
        </div>
      )}
    </div>
  );
}

export default ElectionCardGrid;
