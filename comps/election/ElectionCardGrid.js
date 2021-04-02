import styles from "./ElectionCardGrid.module.css";
import Grid from "@material-ui/core/Grid";
import ElectionCard from "./ElectionCard";

const ElectionCardGrid = ({ elections, admin }) => {
  return (
    <Grid container className={styles.grid}>
      {elections?.map(({ name, url, picture, id, start, end }) => (
        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={id}>
          <div>
            <ElectionCard
              name={name}
              picture={picture}
              start={start}
              end={end}
              href={admin ? "/admin/elections/" + id : "/election/" + url}
            />
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

export default ElectionCardGrid;
