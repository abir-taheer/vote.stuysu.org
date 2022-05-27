import { gql, useMutation, useQuery } from "@apollo/client";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import confirmDialog from "../../../comps/dialog/confirmDialog";
import FAQForm from "../../../comps/faq/FAQForm";
import CenteredCircularProgress from "../../../comps/shared/CenteredCircularProgress";
import Error404 from "../../404";
import layout from "./../../../styles/layout.module.css";

const QUERY = gql`
  query ($id: ObjectID!) {
    faqById(id: $id) {
      id
      title
      url
      body
      updatedAt
    }
  }
`;

const UPDATE_MUTATION = gql`
  mutation (
    $id: ObjectID!
    $title: NonEmptyString!
    $url: NonEmptyString!
    $body: String!
  ) {
    editFAQ(id: $id, title: $title, url: $url, body: $body) {
      id
      title
      url
      body
      updatedAt
    }
  }
`;

const DELETE_MUTATION = gql`
  mutation ($id: ObjectID!) {
    deleteFAQ(id: $id)
  }
`;

const styles = {
  stack: {
    margin: "1rem auto",
  },
};

export default function EditFAQ() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useQuery(QUERY, { variables: { id } });
  const [editing, setEditing] = useState(false);
  const [update, { loading: updating }] = useMutation(UPDATE_MUTATION);
  const [deleteFAQ, { loading: deleting }] = useMutation(DELETE_MUTATION);
  const { enqueueSnackbar } = useSnackbar();

  if (!loading && !data?.faqById) {
    return <Error404 />;
  }

  const handleDelete = async () => {
    const confirmation = await confirmDialog({
      title: "Confirm Deletion",
      body: "Are you sure you want to delete this FAQ? This action is irreversible.",
    });

    if (confirmation) {
      try {
        await deleteFAQ({ variables: { id } });
        enqueueSnackbar("Successfully deleted faq", { variant: "success" });
        await router.push("/admin/faq");
      } catch (e) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  const handleSubmit = async ({ title, url, body }, { setSubmitting }) => {
    try {
      await update({
        variables: {
          id,
          body,
          title,
          url,
        },
      });

      enqueueSnackbar("Your changes were successfully saved", {
        variant: "success",
      });

      setEditing(false);
    } catch (e) {
      await enqueueSnackbar(e.message, { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className={layout.page} maxWidth={"md"}>
      <Typography variant={"h1"} align={"center"}>
        Manage FAQ |{" "}
        <Typography variant="inherit" component={"span"} color="secondary">
          Admin Panel
        </Typography>
      </Typography>

      <AdminTabBar />

      {loading && <CenteredCircularProgress />}

      <Container maxWidth={"sm"}>
        {!!data?.faqById && (
          <>
            <Typography variant={"h4"} align={"center"}>
              {data.faqById.title}
            </Typography>

            {!editing && (
              <div className={layout.center}>
                <Stack direction={"row"} spacing={3} sx={styles.stack}>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => setEditing(true)}
                    disabled={deleting}
                    startIcon={<EditOutlined />}
                  >
                    Edit
                  </Button>

                  <Button
                    variant={"outlined"}
                    color={"warning"}
                    startIcon={<DeleteOutlined />}
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    Delete
                  </Button>
                </Stack>
              </div>
            )}

            <FAQForm
              initialValues={data.faqById}
              onCancel={({ resetForm }) => {
                resetForm();
                setEditing(false);
              }}
              disabled={!editing || updating}
              onSubmit={handleSubmit}
              showCancelButton={editing}
              showSubmitButton={editing}
              submitLabel={"Save"}
            />
          </>
        )}
      </Container>
    </Container>
  );
}
