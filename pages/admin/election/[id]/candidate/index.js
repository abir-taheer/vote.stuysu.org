import { gql, useQuery } from "@apollo/client";
import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";
import joinUrl from "url-join";
import AdminElectionTabBar from "../../../../../comps/admin/AdminElectionTabBar";
import AdminTabBar from "../../../../../comps/admin/AdminTabBar";
import CandidateCard from "../../../../../comps/candidate/CandidateCard";
import ElectionNotFound from "../../../../../comps/election/ElectionNotFound";
import BackButton from "../../../../../comps/shared/BackButton";
import layout from "./../../../../../styles/layout.module.css";

const QUERY = gql`
  query ($id: ObjectID!) {
    electionById(id: $id) {
      id
      name
      candidates(sort: alphabeticalAsc) {
        id
        name
        blurb
        picture {
          resource {
            url
            height
            width
          }
          alt
        }
      }
    }
  }
`;

const CandidateIndex = () => {
  const router = useRouter();
  const { data, loading } = useQuery(QUERY, {
    variables: { id: router.query.id },
    fetchPolicy: "network-only",
  });

  const election = data?.electionById;

  return (
    <Container maxWidth={"md"} className={layout.page}>
      {election && (
        <BackButton
          href={"/admin/election/" + election.id}
          text={"Back to " + election.name}
        />
      )}
      <Typography variant={"h1"} align={"center"}>
        Candidates |{" "}
        <Typography variant="inherit" component={"span"} color="secondary">
          Admin Panel
        </Typography>
      </Typography>

      <AdminTabBar />

      {loading && <CircularProgress />}

      {!loading && !election && <ElectionNotFound href={"/admin/election"} />}

      {!loading && !!election && (
        <>
          <Typography variant={"h2"} color={"secondary"} align={"center"}>
            {election.name}
          </Typography>

          <AdminElectionTabBar />

          <div className={layout.center}>
            <Link href={joinUrl(router.asPath, "/create")} passHref>
              <Button
                color={"secondary"}
                variant={"outlined"}
                startIcon={<Add />}
                className={layout.spaced}
              >
                Add A Candidate
              </Button>
            </Link>
          </div>

          <Typography variant={"body1"} gutterBottom align={"center"}>
            Click on any of the candidates
          </Typography>

          <Grid container justifyContent={"center"} spacing={3}>
            {election.candidates.map(({ picture, blurb, name, id }) => (
              <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={id}>
                <CandidateCard
                  picture={picture}
                  blurb={blurb}
                  name={name}
                  href={"/admin/candidate/" + id}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default CandidateIndex;
