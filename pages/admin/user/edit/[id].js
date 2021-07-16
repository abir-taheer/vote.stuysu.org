import layout from "./../../../../styles/layout.module.css";
import Typography from "@material-ui/core/Typography";
import AdminTabBar from "../../../../comps/admin/AdminTabBar";
import { gql } from "@apollo/client/core";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import Button from "@material-ui/core/Button";
import Delete from "@material-ui/icons/Delete";
import Create from "@material-ui/icons/Create";
import { useState } from "react";
import UserForm from "../../../../comps/user/UserForm";
import { CircularProgress } from "@material-ui/core";
import alertDialog from "../../../../comps/dialog/alertDialog";
import { useSnackbar } from "notistack";
import BackButton from "../../../../comps/shared/BackButton";
import UserNotFound from "../../../../comps/user/UserNotFound";
import confirmDialog from "../../../../comps/dialog/confirmDialog";

const QUERY = gql`
  query ($id: ObjectId!, $pageReady: Boolean!) {
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
    $id: ObjectId!
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
  mutation ($id: ObjectId!) {
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
      <div className={layout.container}>
        <main className={layout.main}>
          <UserNotFound
            href={"/admin/user"}
            buttonLabel={"Back To Admin Panel"}
          />
        </main>
      </div>
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
    <div className={layout.container}>
      <main className={layout.main}>
        <BackButton href={"/admin/user"} text={"Back To Users"} />
        <Typography variant={"h1"}>Edit User | Admin Panel</Typography>

        <AdminTabBar />
        {!editing && (
          <div>
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

        {loading && <CircularProgress />}
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
          />
        )}
      </main>
    </div>
  );
};

export default EditUser;
