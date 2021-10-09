import Pagination from "@mui/lab/Pagination";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import searching from "./../../img/searching.svg";
import layout from "./../../styles/layout.module.css";
import ElectionCard from "./ElectionCard";
import styles from "./ElectionCardGrid.module.css";

const ElectionCardGrid = ({ page, results, numPages, onPageChange, admin }) => {
  if (!numPages) {
    return (
      <div className={styles.notFoundContainer}>
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
      <Grid container className={styles.grid} justify={"center"}>
        {results?.map(({ name, url, picture, id, start, end }) => (
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={id}>
            <div className={styles.itemContainer}>
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
      <div className={layout.center}>
        <Pagination count={numPages} page={page} onChange={onPageChange} />
      </div>
    </div>
  );
};

export default ElectionCardGrid;
