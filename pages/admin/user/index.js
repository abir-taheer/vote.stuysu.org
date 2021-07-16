import AdminRequired from "../../../comps/auth/AdminRequired";
import layout from "../../../styles/layout.module.css";
import Typography from "@material-ui/core/Typography";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import Button from "@material-ui/core/Button";
import { gql } from "@apollo/client/core";
import { useMutation, useQuery } from "@apollo/client";
import alertDialog from "../../../comps/dialog/alertDialog";
import React, { useState } from "react";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import Sync from "@material-ui/icons/Sync";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Add from "@material-ui/icons/Add";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Link from "next/link";
import Pagination from "@material-ui/lab/Pagination";
import styles from "../../../comps/election/ElectionCardGrid.module.css";
import IconButton from "@material-ui/core/IconButton";
import Create from "@material-ui/icons/Create";
import CircularProgress from "@material-ui/core/CircularProgress";

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
    <AdminRequired>
      <div className={layout.container}>
        <main className={layout.main}>
          <Typography variant={"h1"} align={"center"}>
            Users | Admin Panel
          </Typography>
          <AdminTabBar />
          <Typography variant={"h2"} gutterBottom>
            StuyActivities Sync
          </Typography>
          <Typography paragraph align={"center"} variant={"body2"}>
            This will import new students from StuyActivities. <br />
            If all goes well, this is all you'll need to do. <br />
            Do this once before every election cycle.
          </Typography>
          <Button
            variant={"contained"}
            color={"secondary"}
            onClick={handleSync}
            disabled={loadingSync}
            startIcon={<Sync />}
          >
            Sync Users
          </Button>

          <br />
          <Typography variant={"h2"} gutterBottom>
            Manage Users
          </Typography>

          <Link href={"/admin/user/create"}>
            <Button
              variant={"contained"}
              startIcon={<Add />}
              color={"secondary"}
              className={layout.spaced}
            >
              Create New User
            </Button>
          </Link>

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
                </Typography>{" "}
                to your search
              </>
            }
          />

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
                              <Typography
                                variant={"subtitle2"}
                                color={"primary"}
                              >
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
                        <Link href={"/admin/user/edit/" + id}>
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

          <Pagination
            count={data?.allUsers.numPages || 1}
            page={page}
            onChange={onPageChange}
            className={styles.pagination}
          />
        </main>
      </div>
    </AdminRequired>
  );
};

export default UserIndex;
