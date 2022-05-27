import { gql, useQuery } from "@apollo/client";
import Add from "@mui/icons-material/Add";
import Search from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import moment from "moment-timezone/moment-timezone-utils";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import layout from "./../../../styles/layout.module.css";

const QUERY = gql`
  query ($query: String!, $page: PositiveInt!) {
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
  const { data } = useQuery(QUERY, { variables: { query, page } });

  const onPageChange = (ev, pg) => setPage(pg);

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <Typography variant={"h1"} align={"center"}>
        Announcements |{" "}
        <Typography variant="inherit" component={"span"} color="secondary">
          Admin Panel
        </Typography>
      </Typography>

      <AdminTabBar />

      <div className={layout.center}>
        <Link href={"/admin/announcement/create"} passHref>
          <Button
            variant={"outlined"}
            startIcon={<Add />}
            color={"secondary"}
            className={layout.spaced}
          >
            Create Announcement
          </Button>
        </Link>
      </div>

      <div className={layout.center}>
        <TextField
          label={"Search Announcements"}
          value={query}
          onChange={(ev) => {
            setQuery(ev.target.value);
            setPage(1);
          }}
          variant={"outlined"}
          color={"primary"}
          className={layout.spaced}
          InputProps={{
            startAdornment: <Search />,
          }}
        />
      </div>

      <Container maxWidth={"sm"}>
        <List>
          {data?.allAnnouncements.results.map(({ id, title, updatedAt }) => (
            <Fragment key={id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Typography
                      paragraph
                      className={layout.listItemPrimaryText}
                    >
                      {title}
                    </Typography>
                  }
                  secondary={
                    "Last Updated: " +
                    moment(updatedAt).format("MMMM Do YYYY, h:mm:ss a z")
                  }
                />

                <ListItemSecondaryAction>
                  <Link href={"/admin/announcement/" + id} passHref>
                    <Button color={"secondary"} variant={"contained"}>
                      View
                    </Button>
                  </Link>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </Fragment>
          ))}
        </List>
      </Container>

      <div className={layout.center}>
        <Pagination
          count={data?.allAnnouncements.numPages || 1}
          page={page}
          onChange={onPageChange}
        />
      </div>
    </Container>
  );
};

export default AdminAnnouncements;
