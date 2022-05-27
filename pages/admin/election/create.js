import { gql, useMutation } from "@apollo/client";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React from "react";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import alertDialog from "../../../comps/dialog/alertDialog";
import ElectionForm from "../../../comps/election/form/ElectionForm";
import BackButton from "../../../comps/shared/BackButton";
import layout from "./../../../styles/layout.module.css";

const SUBMIT_MUTATION = gql`
  mutation (
    $name: NonEmptyString!
    $url: NonEmptyString!
    $pictureId: ObjectID!
    $type: ElectionType!
    $allowedGradYears: [PositiveInt!]!
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
      await router.push("/admin/election/" + data.createElection.id);
      enqueueSnackbar("Successfully created election", { variant: "success" });
    } catch (er) {
      await alertDialog({ title: "Error creating election", body: er.message });
      setSubmitting(false);
    }
  }

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <BackButton href={"/admin/election"} text={"Back To Elections"} />

      <Typography variant={"h1"} align={"center"}>
        Create Election |{" "}
        <Typography variant="inherit" component={"span"} color="secondary">
          Admin Panel
        </Typography>
      </Typography>

      <AdminTabBar />

      <ElectionForm onSubmit={handleSubmit} disabled={loading} />
    </Container>
  );
};

export default CreateElection;
