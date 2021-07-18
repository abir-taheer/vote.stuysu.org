import layout from "./../../styles/layout.module.css";
import Typography from "@material-ui/core/Typography";
import { useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import { useRouter } from "next/router";
import { parse } from "querystring";
import Search from "@material-ui/icons/Search";
import { gql, useQuery } from "@apollo/client";
import ElectionCardGrid from "../../comps/election/ElectionCardGrid";
import Head from "next/head";

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
    <div className={layout.container}>
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
      <main className={layout.main}>
        <Typography variant={"h1"}>Elections</Typography>
        <TextField
          value={query}
          label={"Search"}
          onChange={handleQueryChange}
          InputProps={{ startAdornment: <Search /> }}
          variant={"outlined"}
        />

        {loading && <CircularProgress className={layout.spaced} />}

        {!loading && (
          <ElectionCardGrid
            numPages={allElections?.numPages}
            page={allElections?.page}
            results={allElections?.results}
            onPageChange={(ev, page) => setPage(page)}
          />
        )}
      </main>
    </div>
  );
};

export default ElectionIndex;
