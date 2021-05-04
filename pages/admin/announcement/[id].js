import { useRouter } from "next/router";
import { gql } from "@apollo/client/core";
import { useMutation, useQuery } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import Error404 from "../../404";
import AdminRequired from "../../../comps/auth/AdminRequired";
import layout from "./../../../styles/layout.module.css";
import Typography from "@material-ui/core/Typography";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import AnnouncementForm from "../../../comps/announcement/AnnouncementForm";
import { useState } from "react";
import Button from "@material-ui/core/Button";
import Create from "@material-ui/icons/Create";
import Delete from "@material-ui/icons/Delete";
import alertDialog from "../../../comps/dialog/alertDialog";
import { useSnackbar } from "notistack";
import confirmDialog from "../../../comps/dialog/confirmDialog";

const QUERY = gql`
  query($id: ObjectId!) {
    announcementById(id: $id) {
      id
      title
      body
      start
      end
      permanent
      election {
        id
        name
      }
      showOnHome
      updatedAt
    }
  }
`;

const EDIT_MUTATION = gql`
  mutation(
    $id: ObjectId!
    $title: NonEmptyString!
    $body: NonEmptyString!
    $start: DateTime
    $end: DateTime
    $permanent: Boolean!
    $showOnHome: Boolean!
    $electionId: ObjectId
  ) {
    editAnnouncement(
      id: $id
      title: $title
      body: $body
      start: $start
      end: $end
      permanent: $permanent
      showOnHome: $showOnHome
      electionId: $electionId
    ) {
      id
      title
      body
      start
      end
      permanent
      election {
        id
        name
      }
      showOnHome
      updatedAt
    }
  }
`;

const DELETE_MUTATION = gql`
  mutation($id: ObjectId!) {
    deleteAnnouncement(id: $id)
  }
`;

export default function ManageAnnouncement() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useQuery(QUERY, { variables: { id } });
  const [isEditing, setIsEditing] = useState(false);
  const [edit] = useMutation(EDIT_MUTATION);
  const [deleteAnnouncement] = useMutation(DELETE_MUTATION, {
    update: (cache) => cache.reset(),
    variables: { id },
  });
  const { enqueueSnackbar } = useSnackbar();

  if (loading) {
    return <CircularProgress />;
  }

  const announcement = data?.announcementById;

  if (!announcement) {
    return <Error404 />;
  }

  const handleDelete = async () => {
    const confirmation = await confirmDialog({
      title: "Are you sure you?",
      body:
        "Are you sure you want to delete this announcement? There is no way to undo this action.",
    });

    if (confirmation) {
      await deleteAnnouncement();
      await router.push("/admin/announcement");
    }
  };

  const handleSubmit = async (
    { title, body, start, end, permanent, showOnHome, election },
    { setSubmitting }
  ) => {
    try {
      const electionId = election?.id;
      await edit({
        variables: {
          id,
          title,
          body,
          start,
          end,
          permanent,
          showOnHome,
          electionId,
        },
      });

      enqueueSnackbar("The announcement was successfully changed", {
        variant: "success",
      });
    } catch (e) {
      await alertDialog({
        title: "Error",
        body: "There was an error editing the announcement: " + e.message,
      });
      setSubmitting(false);
    }

    setIsEditing(false);
  };

  return (
    <AdminRequired>
      <div className={layout.container}>
        <main className={layout.main}>
          <Typography variant={"h1"}>
            Manage Announcement | Admin Panel
          </Typography>
          <AdminTabBar />
          {!isEditing && (
            <div>
              <Button
                variant={"outlined"}
                color={"secondary"}
                onClick={() => setIsEditing(true)}
                className={layout.spaced}
                startIcon={<Create />}
              >
                Edit Announcement
              </Button>
              <Button
                variant={"outlined"}
                className={layout.deleteButton}
                startIcon={<Delete />}
                onClick={handleDelete}
              >
                Delete Announcement
              </Button>
            </div>
          )}
          <AnnouncementForm
            initialValues={announcement}
            disabled={!isEditing}
            showCancelButton
            cancelLabel={"Cancel"}
            onCancel={({ resetForm }) => {
              resetForm();
              setIsEditing(false);
            }}
            onSubmit={handleSubmit}
          />
        </main>
      </div>
    </AdminRequired>
  );
}
