import { gql, useMutation } from "@apollo/client";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React from "react";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import FAQForm from "../../../comps/faq/FAQForm";
import layout from "./../../../styles/layout.module.css";

const MUTATION = gql`
  mutation ($title: NonEmptyString!, $body: String!, $url: NonEmptyString!) {
    createFAQ(url: $url, title: $title, body: $body) {
      id
    }
  }
`;

export default function AdminCreateFAQ() {
  const [create, { loading }] = useMutation(MUTATION);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async ({ title, url, body }, { setSubmitting }) => {
    try {
      const { data } = await create({
        variables: {
          title,
          url,
          body,
        },
      });

      enqueueSnackbar("Successfully created FAQ", { variant: "success" });
      await router.push("/admin/faq/" + data.createFAQ.id);
    } catch (e) {
      enqueueSnackbar(e.message, { variant: "error" });
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <Typography variant={"h1"} align={"center"}>
        Create FAQ |{" "}
        <Typography variant="inherit" component={"span"} color="secondary">
          Admin Panel
        </Typography>
      </Typography>

      <AdminTabBar />

      <Container maxWidth={"sm"}>
        <FAQForm
          submitLabel={"Create"}
          disabled={loading}
          onSubmit={handleSubmit}
        />
      </Container>
    </Container>
  );
}
