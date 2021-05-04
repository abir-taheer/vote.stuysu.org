import React, { useState } from "react";
import AdminRequired from "../../../comps/auth/AdminRequired";
import { gql, useQuery } from "@apollo/client";
import layout from "./../../../styles/layout.module.css";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Add from "@material-ui/icons/Add";
import Link from "next/link";
import { TextField } from "@material-ui/core";
import Search from "@material-ui/icons/Search";

const QUERY = gql`
  query($query: String!) {
    allAnnouncements(query: $query) {
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
  const { data, loading } = useQuery(QUERY, { variables: { query } });

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
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </main>
      </div>
    </AdminRequired>
  );
};

export default AdminAnnouncements;
