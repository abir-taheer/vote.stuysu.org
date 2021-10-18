import { gql, useQuery } from "@apollo/client";
import { HelpOutlineOutlined, SearchOutlined } from "@mui/icons-material";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Pagination,
  TextField,
} from "@mui/material";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import CenteredCircularProgress from "../../comps/shared/CenteredCircularProgress";
import searching from "../../img/searching.svg";
import layout from "./../../styles/layout.module.css";

const QUERY = gql`
  query ($query: String!, $page: PositiveInt!) {
    allFAQs(query: $query, page: $page) {
      results {
        id
        title
        url
        plainTextBody
      }
      page
      numPages
    }
  }
`;

export default function FAQHome() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery(QUERY, { variables: { query, page } });

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <Head>
        <title>FAQs | StuyBOE Voting Site</title>
        <meta property={"og:title"} content={`FAQs | StuyBOE Voting Site`} />
        <meta
          property="og:description"
          content={
            "See commonly asked questions about the election process for Student Union."
          }
        />
      </Head>

      <Typography variant={"h2"} align={"center"}>
        FAQs
      </Typography>

      <div className={layout.center}>
        <TextField
          label={"Search"}
          InputProps={{ startAdornment: <SearchOutlined /> }}
          value={query}
          variant={"outlined"}
          onChange={(ev) => {
            setQuery(ev.target.value);
            setPage(1);
          }}
        />
      </div>

      {loading && <CenteredCircularProgress />}

      <List>
        {data?.allFAQs?.results.map((faq, index) => (
          <Fragment key={faq.id}>
            <Link href={"/faq/" + faq.url}>
              <ListItem button>
                <ListItemIcon>
                  <HelpOutlineOutlined />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant={"inherit"}
                      color={"primary"}
                      component={"span"}
                    >
                      {faq.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant={"body2"} color={"text.secondary"}>
                      {faq.plainTextBody.length <= 100
                        ? faq.plainTextBody
                        : faq.plainTextBody.substring(0, 100) + "..."}
                    </Typography>
                  }
                />
              </ListItem>
            </Link>
            {index !== data?.allFAQs?.results.length - 1 && <Divider />}
          </Fragment>
        ))}
      </List>

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

      {data?.allFAQs?.numPages > 1 && (
        <div className={layout.center}>
          <Pagination
            page={page}
            count={data?.allFAQs?.numPages}
            onChange={(_, p) => setPage(p)}
          />
        </div>
      )}
    </Container>
  );
}
