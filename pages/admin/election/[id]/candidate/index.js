import AdminRequired from "../../../../../comps/auth/AdminRequired";
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
    <AdminRequired>
      <div className={layout.container}>
        <main className={layout.main}>
          <Typography variant={"h1"}>Candidates | Admin Panel</Typography>
          <AdminTabBar />
          {loading && <CircularProgress />}

          {!loading && !election && (
            <ElectionNotFound href={"/admin/election"} />
          )}

          {!loading && !!election && (
            <>
              <Typography variant={"h2"} color={"secondary"}>
                {election.name}
              </Typography>

              <AdminElectionTabBar />

              <Link href={joinUrl(router.asPath, "/create")}>
                <Button
                  color={"secondary"}
                  variant={"outlined"}
                  startIcon={<Add />}
                  className={layout.spaced}
                >
                  Add A Candidate
                </Button>
              </Link>

              <Typography variant={"body1"} gutterBottom>
                Click on any of the candidates
              </Typography>
              <Grid
                container
                justify={"center"}
                className={layout.grid}
                spacing={3}
              >
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
        </main>
      </div>
    </AdminRequired>
  );
};

export default CandidateIndex;
