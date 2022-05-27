import { gql, useMutation, useQuery } from "@apollo/client";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import AdminTabBar from "../../../../../comps/admin/AdminTabBar";
import CandidateForm from "../../../../../comps/candidate/form/CandidateForm";
import alertDialog from "../../../../../comps/dialog/alertDialog";
import ElectionNotFound from "../../../../../comps/election/ElectionNotFound";
import BackButton from "../../../../../comps/shared/BackButton";
import layout from "./../../../../../styles/layout.module.css";

const QUERY = gql`
  query ($id: ObjectID!) {
    electionById(id: $id) {
      id
      name
      url
    }
  }
`;

const CREATE_MUTATION = gql`
  mutation (
    $electionId: ObjectID!
    $name: NonEmptyString!
    $url: NonEmptyString!
    $blurb: String!
    $platform: String!
    $managerIds: [ObjectID!]!
    $pictureId: ObjectID
  ) {
    createCandidate(
      electionId: $electionId
      name: $name
      blurb: $blurb
      platform: $platform
      url: $url
      managerIds: $managerIds
      pictureId: $pictureId
    ) {
      id
    }
  }
`;

const CreateCandidate = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useQuery(QUERY, { variables: { id } });
  const [create] = useMutation(CREATE_MUTATION);

  const onSubmit = async (values, { setSubmitting }) => {
    const managerIds = values.managers.map((user) => user.id);
    const { name, url, blurb, platform, picture } = values;
    try {
      const { data } = await create({
        variables: {
          electionId: id,
          name,
          url,
          blurb,
          platform,
          managerIds,
          pictureId: picture?.id,
        },
      });

      await router.push("/admin/candidate/" + data.createCandidate.id);
    } catch (e) {
      await alertDialog({
        title: "There was an error",
        body: "There was an error creating that candidate:  " + e.message,
      });

      setSubmitting(false);
    }
  };

  const election = data?.electionById;

  return (
    <Container className={layout.page} maxWidth={"md"}>
      {election && (
        <BackButton
          href={"/admin/election/" + election.id + "/candidate"}
          text={election.name + " candidates"}
        />
      )}

      <Typography variant={"h1"} align={"center"}>
        Create Candidate |{" "}
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

          <CandidateForm
            election={election}
            submitLabel={"Create Candidate"}
            onSubmit={onSubmit}
          />
        </>
      )}
    </Container>
  );
};

export default CreateCandidate;
