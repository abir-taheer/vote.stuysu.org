import React, { useState } from "react";
import AdminRequired from "../../../comps/auth/AdminRequired";
import { gql, useQuery } from "@apollo/client";
import layout from "./../../../styles/layout.module.css";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Add from "@material-ui/icons/Add";
import Link from "next/link";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Search from "@material-ui/icons/Search";
import styles from "../../../comps/election/ElectionCardGrid.module.css";
import Pagination from "@material-ui/lab/Pagination";
import List from "@material-ui/core/List";
import moment from "moment-timezone/moment-timezone-utils";
import { Divider } from "@material-ui/core";

const QUERY = gql`
  query($query: String!, $page: PositiveInt!) {
    allAnnouncements(query: $query, page: $page) {
      page
      numPages
      results {
        id
        title
        body
        updatedAt
      }
    }
  }
`;

const AdminAnnouncements = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery(QUERY, { variables: { query, page } });

  const onPageChange = (ev, pg) => setPage(pg);

  return (
    <AdminRequired>
      <div className={layout.container}>
        <main className={layout.main}>
          <Typography variant={"h1"} align={"center"}>
            Announcements | Admin Panel
          </Typography>

          <AdminTabBar />
          <Link href={"/admin/announcement/create"}>
            <Button
              variant={"outlined"}
              startIcon={<Add />}
              color={"secondary"}
              className={layout.spaced}
            >
              Create Announcement
            </Button>
          </Link>

          <br />
          <TextField
            label={"Search Announcements"}
            value={query}
            onChange={(ev) => setQuery(ev.target.value)}
            variant={"outlined"}
            color={"primary"}
            className={layout.spaced}
            InputProps={{
              startAdornment: <Search />,
            }}
          />

          <List>
            {data?.allAnnouncements.results.map((announcement) => (
              <>
                <ListItem alignItems="flex-start" key={announcement.id}>
                  <ListItemText
                    primary={
                      <Typography
                        paragraph
                        className={layout.listItemPrimaryText}
                      >
                        {announcement.title}
                      </Typography>
                    }
                    secondary={
                      "Last Updated: " +
                      moment(announcement.updatedAt).format(
                        "MMMM Do YYYY, h:mm:ss a z"
                      )
                    }
                  />

                  <ListItemSecondaryAction>
                    <Link href={"/admin/announcement/" + announcement.id}>
                      <Button color={"secondary"} variant={"contained"}>
                        View
                      </Button>
                    </Link>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </>
            ))}
          </List>
          <Pagination
            count={data?.allAnnouncements.numPages}
            page={data?.allAnnouncements.page}
            onChange={onPageChange}
            className={styles.pagination}
          />
        </main>
      </div>
    </AdminRequired>
  );
};

export default AdminAnnouncements;
