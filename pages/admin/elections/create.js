import React from "react";
import AdminRequired from "../../../comps/auth/AdminRequired";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import Typography from "@material-ui/core/Typography";

import layout from "./../../../styles/layout.module.css";
import ElectionForm from "../../../comps/election/ElectionForm";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import alertDialog from "../../../comps/dialog/alertDialog";
import { useSnackbar } from "notistack";

const SUBMIT_MUTATION = gql`
  mutation(
    $name: String!
    $url: String!
    $pictureId: ObjectId!
    $type: ElectionType!
    $allowedGradYears: [Int!]!
    $start: DateTime!
    $end: DateTime!
  ) {
    createElection(
      name: $name
      url: $url
      pictureId: $pictureId
      type: $type
      allowedGradYears: $allowedGradYears
      start: $start
      end: $end
    ) {
      id
    }
  }
`;

const CreateElection = () => {
  const [submit, { loading }] = useMutation(SUBMIT_MUTATION);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(
    { name, url, pictureId, type, allowedGradYears, start, end },
    { setSubmitting }
  ) {
    const variables = {
      name,
      url,
      pictureId,
      type,
      allowedGradYears,
      start: new Date(start),
      end: new Date(end),
    };

    try {
      const { data } = await submit({ variables });
      await router.push("/admin/elections/" + data.createElection.id);
      enqueueSnackbar("Successfully created election", { variant: "success" });
    } catch (er) {
      await alertDialog({ title: "Error creating election", body: er.message });
      setSubmitting(false);
    }
  }

  return (
    <AdminRequired>
      <div className={layout.container}>
        <main className={layout.main}>
          <Typography variant={"h1"} align={"center"}>
            Create Election | Admin Panel
          </Typography>

          <AdminTabBar />

          <ElectionForm onSubmit={handleSubmit} disabled={loading} />
        </main>
      </div>
    </AdminRequired>
  );
};

export default CreateElection;
