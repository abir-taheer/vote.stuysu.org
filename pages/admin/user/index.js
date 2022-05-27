import { gql, useMutation, useQuery } from "@apollo/client";
import Add from "@mui/icons-material/Add";
import Create from "@mui/icons-material/Create";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import Sync from "@mui/icons-material/Sync";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import React, { useState } from "react";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import alertDialog from "../../../comps/dialog/alertDialog";
import layout from "../../../styles/layout.module.css";

const SYNC_MUTATION = gql`
  mutation {
    syncUsersWithStuyActivities {
      totalUsersCreated
      completedAt
    }
  }
`;

const USER_QUERY = gql`
  query ($page: PositiveInt!, $query: String!) {
    allUsers(page: $page, query: $query) {
      numPages
      page
      total
      results {
        id
        name
        email
        gradYear
        grade
        adminPrivileges
      }
    }
  }
`;

const UserIndex = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sync, { loading: loadingSync }] = useMutation(SYNC_MUTATION);
  const { data, loading: loadingUsers } = useQuery(USER_QUERY, {
    variables: {
      page,
      query,
    },
  });

  const handleSync = async () => {
    try {
      const { data } = await sync();

      alertDialog({
        title: "Successfully synced users",
        body: `The sync was successful, ${data.syncUsersWithStuyActivities.totalUsersCreated} new users were added.`,
      });
    } catch (e) {
      alertDialog({
        title: "Error Syncing Users",
        body: "There was an error: " + e.message,
      });
    }
  };

  const onPageChange = (ev, pg) => setPage(pg);

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <Typography variant={"h1"} align={"center"}>
        Users |{" "}
        <Typography variant="inherit" component={"span"} color="secondary">
          Admin Panel
        </Typography>
      </Typography>

      <AdminTabBar />

      <Typography variant={"h2"} gutterBottom align={"center"}>
        StuyActivities Sync
      </Typography>

      <Typography paragraph align={"center"} variant={"body2"}>
        This will import new students from StuyActivities. <br />
        If all goes well, this is all you&apos;ll need to do. <br />
        Do this once before every election cycle.
      </Typography>
      <div className={layout.center}>
        <Button
          variant={"contained"}
          color={"secondary"}
          onClick={handleSync}
          disabled={loadingSync}
          startIcon={<Sync />}
        >
          Sync Users
        </Button>
      </div>

      <br />
      <Typography variant={"h2"} gutterBottom align={"center"}>
        Manage Users
      </Typography>

      <div className={layout.center}>
        <Link href={"/admin/user/create"} passHref>
          <Button
            variant={"contained"}
            startIcon={<Add />}
            color={"secondary"}
            className={layout.spaced}
          >
            Create New User
          </Button>
        </Link>
      </div>

      <Container maxWidth={"sm"}>
        <div className={layout.center}>
          <TextField
            variant={"outlined"}
            InputProps={{ startAdornment: <SearchOutlined /> }}
            className={layout.spaced}
            label={"Search Users"}
            value={query}
            onChange={(ev) => setQuery(ev.target.value)}
            helperText={
              <>
                To filter only users who have admin privileges, add{" "}
                <Typography
                  component={"span"}
                  color={"primary"}
                  variant={"inherit"}
                >
                  <b>:admin</b>
                </Typography>
                to your search
              </>
            }
          />
        </div>

        <div className={layout.scrollableListContainer}>
          {loadingUsers && <CircularProgress />}

          {!loadingUsers && !data?.allUsers.total && (
            <Typography paragraph>
              There are no users for that search query
            </Typography>
          )}

          <List className={layout.scrollableList}>
            {data?.allUsers.results.map(
              ({ id, name, email, grade, gradYear, adminPrivileges }) => (
                <div key={id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <>
                          <Typography
                            paragraph
                            className={layout.listItemPrimaryText}
                            gutterBottom
                          >
                            {name}
                          </Typography>{" "}
                          {adminPrivileges && (
                            <Typography variant={"subtitle2"} color={"primary"}>
                              (BOE Admin)
                            </Typography>
                          )}
                        </>
                      }
                      secondary={
                        <>
                          <Typography variant={"subtitle2"}>
                            {email}
                            {gradYear &&
                              ` | Class of ${gradYear} | Grade ${grade}`}
                          </Typography>
                        </>
                      }
                    />

                    <ListItemSecondaryAction>
                      <Link href={"/admin/user/edit/" + id} passHref>
                        <IconButton edge="end" focusRipple>
                          <Create />
                        </IconButton>
                      </Link>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </div>
              )
            )}
          </List>
        </div>
      </Container>

      <div className={layout.center}>
        <Pagination
          count={data?.allUsers.numPages || 1}
          page={page}
          onChange={onPageChange}
        />
      </div>
    </Container>
  );
};

export default UserIndex;
