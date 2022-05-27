import { gql, useQuery } from "@apollo/client";
import Add from "@mui/icons-material/Add";
import Search from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import ElectionCardGrid from "../../../comps/election/ElectionCardGrid";
import CenteredCircularProgress from "../../../comps/shared/CenteredCircularProgress";
import layout from "../../../styles/layout.module.css";

const ELECTIONS_QUERY = gql`
  query (
    $query: String!
    $openElectionsPage: PositiveInt!
    $pastElectionsPage: PositiveInt!
  ) {
    openElections(query: $query, page: $openElectionsPage) {
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

    pastElections(query: $query, page: $pastElectionsPage) {
      page
      numPages
      total
      results {
        id
        name
        start
        url
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

const AdminElections = () => {
  const router = useRouter();
  const [query, setQuery] = useState(router.query.q || "");
  const [openElectionsPage, setOpenElectionsPage] = useState(1);
  const [pastElectionsPage, setPastElectionsPage] = useState(1);
  const { data, loading } = useQuery(ELECTIONS_QUERY, {
    variables: { openElectionsPage, pastElectionsPage, query },
    fetchPolicy: "network-only",
  });

  const openElections = data?.openElections;
  const pastElections = data?.pastElections;

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <Typography variant={"h1"} align={"center"}>
        Elections |{" "}
        <Typography variant="inherit" component={"span"} color="secondary">
          Admin Panel
        </Typography>
      </Typography>

      <AdminTabBar />

      <div className={layout.center}>
        <Link href={"/admin/election/create"} passHref>
          <Button startIcon={<Add />} variant={"outlined"} color={"secondary"}>
            Create Election
          </Button>
        </Link>
      </div>

      <div className={layout.center}>
        <TextField
          label={"Search Elections"}
          value={query}
          variant={"outlined"}
          color={"primary"}
          InputProps={{
            endAdornment: <Search />,
          }}
          className={layout.spaced}
          onChange={(ev) => {
            setQuery(ev.target.value);
            router.push(router.pathname, { query: { q: ev.target.value } });
          }}
        />
      </div>

      {loading && <CenteredCircularProgress />}
      {!loading && (
        <>
          <Typography variant={"h2"} align={"center"}>
            Open Elections
          </Typography>
          <ElectionCardGrid
            numPages={openElections?.numPages}
            page={openElections?.page}
            results={openElections?.results}
            onPageChange={(ev, page) => setOpenElectionsPage(page)}
            admin
          />

          <Typography variant={"h2"} align={"center"}>
            Past Elections
          </Typography>

          <ElectionCardGrid
            numPages={pastElections?.numPages}
            page={pastElections?.page}
            results={pastElections?.results}
            onPageChange={(ev, page) => setPastElectionsPage(page)}
            admin
          />
        </>
      )}
    </Container>
  );
};

export default AdminElections;
