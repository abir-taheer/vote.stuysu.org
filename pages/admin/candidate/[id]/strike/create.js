import { gql, useMutation, useQuery } from "@apollo/client";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import React from "react";
import AdminTabBar from "../../../../../comps/admin/AdminTabBar";
import alertDialog from "../../../../../comps/dialog/alertDialog";
import BackButton from "../../../../../comps/shared/BackButton";
import LoadingScreen from "../../../../../comps/shared/LoadingScreen";
import StrikeForm from "../../../../../comps/strike/StrikeForm";
import Error404 from "../../../../404";
import layout from "./../../../../../styles/layout.module.css";

const MUTATION = gql`
  mutation (
    $candidateId: ObjectID!
    $weight: NonNegativeFloat!
    $reason: String!
  ) {
    createStrike(candidateId: $candidateId, weight: $weight, reason: $reason) {
      id
    }
  }
`;

const QUERY = gql`
  query ($id: ObjectID!) {
    candidateById(id: $id) {
      id
      name
      url
      strikes {
        id
        weight
        reason
        updatedAt
        createdAt
      }
    }
  }
`;

const CreateStrike = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useQuery(QUERY, {
    variables: { id },
  });
  const [submit, { loading: creating }] = useMutation(MUTATION);

  if (loading) {
    return <LoadingScreen />;
  }

  const candidate = data.candidateById;
  if (!candidate) {
    return <Error404 />;
  }
  const handleSubmit = async ({ reason, weight }, { setSubmitting }) => {
    try {
      const { data: res } = await submit({
        variables: {
          weight,
          reason,
          candidateId: id,
        },
      });

      await router.push("/admin/candidate/" + id + "/strike/");
    } catch (e) {
      await alertDialog({
        title: "Error",
        body: "There was an error creating the strike: " + e.message,
      });
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <BackButton
        href={"/admin/candidate/" + id + "/strike"}
        text={"Back To " + candidate.name}
      />

      <Typography variant={"h1"} align={"center"}>
        Create Strike for{" "}
        <Typography variant={"inherit"} component={"span"} color={"secondary"}>
          {candidate.name}
        </Typography>{" "}
        |{" "}
        <Typography variant="inherit" component={"span"} color="secondary">
          Admin Panel
        </Typography>
      </Typography>

      <AdminTabBar />

      <StrikeForm onSubmit={handleSubmit} disabled={creating} />
    </Container>
  );
};

export default CreateStrike;
