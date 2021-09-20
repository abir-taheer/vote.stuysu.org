import layout from "./../../../../../styles/layout.module.css";
import AdminTabBar from "../../../../../comps/admin/AdminTabBar";
import AdminElectionTabBar from "../../../../../comps/admin/AdminElectionTabBar";
import Typography from "@material-ui/core/Typography";
import { gql, useQuery } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import ElectionNotFound from "../../../../../comps/election/ElectionNotFound";
import { useRouter } from "next/router";
import Link from "next/link";
import joinUrl from "url-join";
import Button from "@material-ui/core/Button";
import Add from "@material-ui/icons/Add";
import Grid from "@material-ui/core/Grid";
import CandidateCard from "../../../../../comps/candidate/CandidateCard";
import Container from "@material-ui/core/Container";
import BackButton from "../../../../../comps/shared/BackButton";

const QUERY = gql`
  query ($id: ObjectId!) {
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
        Candidates | Admin Panel
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

          <Grid container justify={"center"} spacing={3}>
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
