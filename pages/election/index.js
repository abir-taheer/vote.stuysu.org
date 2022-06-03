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
import sortElections from "../../utils/election/sortElections";
import layout from "./../../styles/layout.module.css";

const QUERY = gql`
  query ($query: String!, $openPage: PositiveInt!, $closedPage: PositiveInt!) {
    openElections(page: $openPage, query: $query) {
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

    pastElections(query: $query, page: $closedPage) {
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
  const [closedPage, setClosedPage] = useState(1);
  const [openPage, setOpenPage] = useState(1);

  const { data, loading } = useQuery(QUERY, {
    variables: { query, openPage, closedPage },
  });

  function handleQueryChange(ev) {
    setQuery(ev.target.value);
    setClosedPage(1);
    setOpenPage(1);
    router.push(router.pathname, { query: { q: ev.target.value } });
  }

  const pastElections = data?.pastElections;
  const openElections = data?.openElections;

  if (openElections?.results?.length) {
    sortElections(openElections.results);
  }

  if (pastElections?.results?.length) {
    sortElections(pastElections.results);
  }

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

      {!loading && !!openElections?.results?.length && (
        <>
          <Typography variant={"h3"} align={"center"}>
            Current Elections
          </Typography>
          <ElectionCardGrid
            numPages={openElections?.numPages}
            page={openElections?.page}
            results={openElections?.results}
            onPageChange={(ev, page) => setOpenPage(page)}
          />
        </>
      )}

      {!loading && (
        <>
          <Typography variant={"h3"} align={"center"}>
            Completed Elections
          </Typography>

          <ElectionCardGrid
            numPages={pastElections?.numPages}
            page={pastElections?.page}
            results={pastElections?.results}
            onPageChange={(ev, page) => setClosedPage(page)}
          />
        </>
      )}
    </Container>
  );
};

export default ElectionIndex;
