import { getDataFromTree } from "@apollo/client/react/ssr";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext } from "react";
import withApollo from "../../../comps/apollo/withApollo";
import LoginButton from "../../../comps/auth/LoginButton";
import UserContext from "../../../comps/auth/UserContext";
import ElectionTabBar from "../../../comps/election/ElectionTabBar";
import PluralityAudit from "../../../comps/election/PluralityAudit";
import RunoffAudit from "../../../comps/election/RunoffAudit";
import useElectionByUrl from "../../../comps/election/useElectionByUrl";
import BackButton from "../../../comps/shared/BackButton";
import CenteredCircularProgress from "../../../comps/shared/CenteredCircularProgress";
import layout from "../../../styles/layout.module.css";
import Error404 from "../../404";

function AuditElectionHeading({ election }) {
  return (
    <>
      <Head>
        <title>Audit - {election.name} | StuyBOE Voting Site</title>
        <meta
          property={"og:title"}
          content={`Audit - ${election.name} | StuyBOE Voting Site`}
        />
        <meta
          property="og:description"
          content={`Results for ${election.name}`}
        />
        <meta property="og:image" content={election.picture.resource?.url} />
        <meta property="og:image:alt" content={election.picture.alt} />
        <meta
          property="og:image:height"
          content={election.picture.resource.height}
        />
        <meta
          property="og:image:width"
          content={election.picture.resource.width}
        />
        <meta
          property="og:image:type"
          content={
            election.picture.resource.resourceType +
            "/" +
            election.picture.resource.format
          }
        />
      </Head>

      <BackButton
        href={"/election"}
        variant={"outlined"}
        text={"Back To Elections"}
      />

      <Typography variant={"h1"} className={layout.title} align={"center"}>
        {election.name}
      </Typography>

      <ElectionTabBar completed={election.completed} />
    </>
  );
}

function AuditElection() {
  const router = useRouter();
  const user = useContext(UserContext);
  const { url } = router.query;
  const { election, loading: loadingElection } = useElectionByUrl(url);

  if (loadingElection) {
    return <CenteredCircularProgress />;
  }

  if (user.ready && !user.signedIn) {
    return (
      <Container maxWidth={"md"} className={layout.page}>
        <AuditElectionHeading election={election} />

        <Typography
          variant={"body1"}
          color={"error"}
          paragraph
          align={"center"}
        >
          You need to be authenticated in order to audit the election.
        </Typography>
        <div className={layout.center}>
          <LoginButton />
        </div>
      </Container>
    );
  }

  if (!election) {
    return <Error404 />;
  }

  if (!election.completed) {
    return (
      <Container maxWidth={"md"} className={layout.page}>
        <AuditElectionHeading election={election} />

        <Typography
          variant={"body1"}
          color={"error"}
          align={"center"}
          paragraph
        >
          This election is not complete and so the audit is not yet available.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <AuditElectionHeading election={election} />

      {election.type === "runoff" && <RunoffAudit election={election} />}
      {election.type === "plurality" && <PluralityAudit election={election} />}
    </Container>
  );
}

export default withApollo(AuditElection, { getDataFromTree });
