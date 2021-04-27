import React from "react";
import AdminRequired from "../../../../../comps/auth/AdminRequired";
import layout from "./../../../../../styles/layout.module.css";
import AdminTabBar from "../../../../../comps/admin/AdminTabBar";
import Typography from "@material-ui/core/Typography";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { CircularProgress } from "@material-ui/core";
import ElectionNotFound from "../../../../../comps/election/ElectionNotFound";
import CandidateForm from "../../../../../comps/candidate/CandidateForm";
import alertDialog from "../../../../../comps/dialog/alertDialog";

const QUERY = gql`
  query($id: ObjectId!) {
    electionById(id: $id) {
      id
      name
      url
    }
  }
`;

const CREATE_MUTATION = gql`
  mutation(
    $electionId: ObjectId!
    $name: NonEmptyString!
    $url: NonEmptyString!
    $blurb: String!
    $platform: String!
    $managerIds: [ObjectId!]!
    $pictureId: ObjectId
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
    <AdminRequired>
      <div className={layout.container}>
        <main className={layout.main}>
          <Typography variant={"h1"}>Create Candidate | Admin Panel</Typography>
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

              <CandidateForm
                election={election}
                submitLabel={"Create Candidate"}
                onSubmit={onSubmit}
              />
            </>
          )}
        </main>
      </div>
    </AdminRequired>
  );
};

export default CreateCandidate;
