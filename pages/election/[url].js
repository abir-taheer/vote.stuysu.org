import React from "react";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import withApollo from "../../comps/apollo/withApollo";
import layout from "./../../styles/layout.module.css";
import Error404 from "../404";
import Typography from "@material-ui/core/Typography";

const ELECTION_QUERY = gql`
  query($url: String!) {
    electionByUrl(url: $url) {
      id
      name
    }
  }
`;

const Election = () => {
  const router = useRouter();
  const { url } = router.query;
  const { data } = useQuery(ELECTION_QUERY, { variables: { url } });

  const election = data?.electionByUrl;
  if (!election) {
    return <Error404 />;
  }

  return (
    <div className={layout.container}>
      <main className={layout.main}>
        <Typography variant={"h1"} className={layout.title} color={"primary"}>
          {election.name}
        </Typography>
      </main>
    </div>
  );
};

export default withApollo({ ssr: true })(Election);
