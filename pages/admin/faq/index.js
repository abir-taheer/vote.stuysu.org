import { gql, useQuery } from "@apollo/client";
import AddOutlined from "@mui/icons-material/AddOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
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
    <Container maxWidth={"md"} className={layout.page}>
      <Typography variant={"h1"} align={"center"}>
        FAQ |{" "}
        <Typography variant="inherit" component={"span"} color="secondary">
          Admin Panel
        </Typography>
      </Typography>

      <AdminTabBar />

      <div className={layout.center}>
        <Link href={"/admin/faq/create"} passHref>
          <Button
            startIcon={<AddOutlined />}
            variant={"contained"}
            color={"secondary"}
          >
            Create FAQ
          </Button>
        </Link>
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

      <Container maxWidth={"sm"}>
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
    </Container>
  );
}
