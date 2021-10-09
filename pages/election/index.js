import { gql, useQuery } from "@apollo/client";
import Search from "@mui/icons-material/Search";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { useRouter } from "next/router";
import { parse } from "querystring";
import { useState } from "react";
import ElectionCardGrid from "../../comps/election/ElectionCardGrid";
import CenteredCircularProgress from "../../comps/shared/CenteredCircularProgress";
import layout from "./../../styles/layout.module.css";

const QUERY = gql`
  query ($query: String!, $page: PositiveInt!) {
    allElections(query: $query, page: $page) {
      page
      numPages
      total
      results {
        id
        name
        url
        start
        end
        picture {
          id
          resource {
            id
            url
            width
            height
          }
          alt
        }
      }
    }
  }
`;

const ElectionIndex = () => {
  const router = useRouter();
  const params = parse(router.asPath.substr(router.asPath.indexOf("?") + 1));
  const [query, setQuery] = useState(params.q || "");
  const [page, setPage] = useState(1);

  const { data, loading } = useQuery(QUERY, { variables: { query, page } });

  function handleQueryChange(ev) {
    setQuery(ev.target.value);
    setPage(1);
    router.push(router.pathname, { query: { q: ev.target.value } });
  }

  const allElections = data?.allElections;

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <Head>
        <title>Elections | StuyBOE Voting Site</title>
        <meta
          property={"og:title"}
          content={"Elections | StuyBOE Voting Site"}
        />

        <meta
          property={"og:description"}
          content={
            "View all of the current and past elections for Student Union Elections"
          }
        />

        <meta
          property={"description"}
          content={
            "View all of the current and past elections for Student Union Elections"
          }
        />
      </Head>
      <Typography variant={"h1"} align={"center"}>
        Elections
      </Typography>

      <div className={layout.center}>
        <TextField
          value={query}
          label={"Search"}
          onChange={handleQueryChange}
          InputProps={{ startAdornment: <Search /> }}
          variant={"outlined"}
        />
      </div>

      {loading && <CenteredCircularProgress />}

      {!loading && (
        <ElectionCardGrid
          numPages={allElections?.numPages}
          page={allElections?.page}
          results={allElections?.results}
          onPageChange={(ev, page) => setPage(page)}
        />
      )}
    </Container>
  );
};

export default ElectionIndex;
