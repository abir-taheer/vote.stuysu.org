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

const QUERY = gql`
  query($id: ObjectId!) {
    electionById(id: $id) {
      id
      name
      candidates {
        id
        name
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
  const { id } = router.query;
  const { data, loading } = useQuery(QUERY, { variables: { id } });

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
                >
                  Add A Candidate
                </Button>
              </Link>
            </>
          )}
        </main>
      </div>
    </AdminRequired>
  );
};

export default CandidateIndex;
