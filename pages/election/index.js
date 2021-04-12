import layout from "./../../styles/layout.module.css";
import Typography from "@material-ui/core/Typography";
import { useState } from "react";
import { CircularProgress, TextField } from "@material-ui/core";
import { useRouter } from "next/router";
import { parse } from "querystring";
import Search from "@material-ui/icons/Search";
import { gql, useQuery } from "@apollo/client";
import ElectionCardGrid from "../../comps/election/ElectionCardGrid";

const QUERY = gql`
  query($query: String!, $page: Int!) {
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
      <main className={layout.main}>
        <Typography variant={"h1"}>Elections</Typography>
        <TextField
          value={query}
          label={"Search"}
          onChange={handleQueryChange}
          InputProps={{ startAdornment: <Search /> }}
          variant={"outlined"}
        />

        {loading && <CircularProgress />}

        {!loading && (
          <ElectionCardGrid
            numPages={allElections?.numPages}
            page={allElections?.page}
            results={allElections?.results}
            onPageChange={(ev, page) => setPage(page)}
            admin
          />
        )}
      </main>
    </div>
  );
};

export default ElectionIndex;
