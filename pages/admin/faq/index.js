import { gql, useQuery } from "@apollo/client";
import { AddOutlined, SearchOutlined } from "@mui/icons-material";
import { ListItemSecondaryAction, Pagination, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import CenteredCircularProgress from "../../../comps/shared/CenteredCircularProgress";
import searching from "../../../img/searching.svg";
import layout from "./../../../styles/layout.module.css";

const QUERY = gql`
  query ($query: String!, $page: PositiveInt!) {
    allFAQs(query: $query, page: $page) {
      results {
        id
        title
        url
        updatedAt
      }
      page
      numPages
    }
  }
`;

const styles = {
  searchField: {
    margin: "1rem",
  },
  list: { width: "100%", bgcolor: "background.paper", marginBottom: "1rem" },
};

export default function FAQAdminHome() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery(QUERY, {
    variables: { query, page },
    fetchPolicy: "network-only",
  });

  return (
    <Container maxWidth={"sm"} className={layout.page}>
      <Typography variant={"h1"} align={"center"}>
        FAQ | Admin Panel
      </Typography>

      <AdminTabBar />

      <div className={layout.center}>
        <Button
          startIcon={<AddOutlined />}
          variant={"contained"}
          color={"secondary"}
        >
          Create FAQ
        </Button>
      </div>

      <div className={layout.center}>
        <TextField
          sx={styles.searchField}
          variant={"outlined"}
          value={query}
          onChange={(ev) => {
            setQuery(ev.target.value);
            setPage(1);
          }}
          label={"Search"}
          InputProps={{
            startAdornment: <SearchOutlined />,
          }}
        />
      </div>

      {loading && <CenteredCircularProgress />}

      {!!data && !data.allFAQs?.results?.length && (
        <div>
          <Typography variant={"body1"} color={"error"} align={"center"}>
            There are no results
          </Typography>
          <div className={layout.center}>
            <Image
              src={searching}
              alt={"Someone with a magnifying glass pointed at the ground"}
              height={180}
              width={250}
            />
          </div>
        </div>
      )}

      {!!data && !!data.allFAQs?.results?.length && (
        <>
          <List sx={styles.list}>
            {data.allFAQs.results.map((faq) => (
              <Fragment key={faq.id}>
                <Link href={"/admin/faq/" + faq.id} passHref>
                  <ListItem button>
                    <ListItemText primary={faq.title} secondary={faq.url} />
                    <ListItemSecondaryAction>
                      <Typography
                        variant={"subtitle2"}
                        color={"text.secondary"}
                      >
                        Click To Edit
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Link>
                <Divider />
              </Fragment>
            ))}
          </List>

          <div className={layout.center}>
            <Pagination
              page={page}
              count={data.allFAQs.numPages}
              onChange={(_, p) => setPage(p)}
            />
          </div>
        </>
      )}
    </Container>
  );
}
