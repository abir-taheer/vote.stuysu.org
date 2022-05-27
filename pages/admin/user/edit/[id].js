import { gql, useMutation, useQuery } from "@apollo/client";
import Create from "@mui/icons-material/Create";
import Delete from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useState } from "react";
import AdminTabBar from "../../../../comps/admin/AdminTabBar";
import alertDialog from "../../../../comps/dialog/alertDialog";
import confirmDialog from "../../../../comps/dialog/confirmDialog";
import BackButton from "../../../../comps/shared/BackButton";
import CenteredCircularProgress from "../../../../comps/shared/CenteredCircularProgress";
import UserForm from "../../../../comps/user/form/UserForm";
import UserNotFound from "../../../../comps/user/UserNotFound";
import layout from "./../../../../styles/layout.module.css";

const QUERY = gql`
  query ($id: ObjectID!, $pageReady: Boolean!) {
    userById(id: $id) @include(if: $pageReady) {
      id
      firstName
      lastName
      email
      gradYear
      adminPrivileges
    }

    userIsDeletable(id: $id) @include(if: $pageReady)
  }
`;

const EDIT_MUTATION = gql`
  mutation (
    $id: ObjectID!
    $firstName: NonEmptyString!
    $lastName: NonEmptyString!
    $email: EmailAddress!
    $gradYear: PositiveInt
    $adminPrivileges: Boolean!
  ) {
    editUser(
      id: $id
      firstName: $firstName
      lastName: $lastName
      email: $email
      gradYear: $gradYear
      adminPrivileges: $adminPrivileges
    ) {
      id
      name
      firstName
      lastName
      gradYear
      grade
      adminPrivileges
    }
  }
`;

const DELETE_MUTATION = gql`
  mutation ($id: ObjectID!) {
    deleteUser(id: $id)
  }
`;

const EditUser = () => {
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = router.query;
  const pageReady = !!id;
  const { data, loading } = useQuery(QUERY, { variables: { id, pageReady } });
  const [edit] = useMutation(EDIT_MUTATION);
  const [deleteUser, { loading: loadingDeleteUser }] = useMutation(
    DELETE_MUTATION,
    { variables: { id } }
  );

  const user = data?.userById;
  if (!pageReady) {
    return null;
  }

  if (pageReady && !loading && !user) {
    return (
      <Container maxWidth={"xs"} className={layout.page}>
        <UserNotFound
          href={"/admin/user"}
          buttonLabel={"Back To Admin Panel"}
        />
      </Container>
    );
  }

  const handleDelete = async () => {
    const confirmation = await confirmDialog({
      title: "Are you sure?",
      body: "You will not be able to undo deleting a user",
    });

    if (confirmation) {
      try {
        await deleteUser();
        await router.push("/admin/user");
      } catch (e) {
        alertDialog({
          title: "Couldn't delete user",
          body: e.message,
        });
      }
    }
  };

  const handleSubmit = async (
    { firstName, lastName, email, adminPrivileges, gradYear },
    { setSubmitting }
  ) => {
    try {
      await edit({
        variables: {
          id,
          firstName,
          lastName,
          email,
          adminPrivileges,
          gradYear: gradYear || null,
        },
      });
      setSubmitting(false);
      setEditing(false);

      await enqueueSnackbar("Your changes were saved successfully", {
        variant: "success",
      });
    } catch (e) {
      alertDialog({
        title: "There was an error",
        body: e.message,
      });
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <BackButton href={"/admin/user"} text={"Back To Users"} />
      <Typography variant={"h1"} align={"center"}>
        Edit User |{" "}
        <Typography variant="inherit" component={"span"} color="secondary">
          Admin Panel
        </Typography>
      </Typography>

      <AdminTabBar />
      {!editing && (
        <div className={layout.center}>
          <Button
            startIcon={<Create />}
            variant={"outlined"}
            className={layout.spaced}
            color={"secondary"}
            onClick={() => setEditing(true)}
          >
            Edit User
          </Button>
          <Button
            startIcon={<Delete />}
            variant={"outlined"}
            className={layout.deleteButton}
            disabled={!data?.userIsDeletable || loadingDeleteUser}
            onClick={handleDelete}
          >
            Delete User
          </Button>
        </div>
      )}

      {loading && <CenteredCircularProgress />}

      {!loading && (
        <UserForm
          initialValues={user}
          cancelLabel={"Cancel"}
          showCancelButton
          disabled={!editing}
          onCancel={({ resetForm }) => {
            resetForm();
            setEditing(false);
          }}
          onSubmit={handleSubmit}
          submitLabel={"Save"}
        />
      )}
    </Container>
  );
};

export default EditUser;
