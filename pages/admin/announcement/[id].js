import { gql, useMutation, useQuery } from "@apollo/client";
import Create from "@mui/icons-material/Create";
import Delete from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useState } from "react";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import AnnouncementForm from "../../../comps/announcement/form/AnnouncementForm";
import alertDialog from "../../../comps/dialog/alertDialog";
import confirmDialog from "../../../comps/dialog/confirmDialog";
import BackButton from "../../../comps/shared/BackButton";
import LoadingScreen from "../../../comps/shared/LoadingScreen";
import Error404 from "../../404";
import layout from "./../../../styles/layout.module.css";

const QUERY = gql`
  query ($id: ObjectID!) {
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
  mutation (
    $id: ObjectID!
    $title: NonEmptyString!
    $body: NonEmptyString!
    $start: DateTime
    $end: DateTime
    $permanent: Boolean!
    $showOnHome: Boolean!
    $electionId: ObjectID
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
  mutation ($id: ObjectID!) {
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
    return <LoadingScreen />;
  }

  const announcement = data?.announcementById;

  if (!announcement) {
    return <Error404 />;
  }

  const handleDelete = async () => {
    const confirmation = await confirmDialog({
      title: "Are you sure you?",
      body: "Are you sure you want to delete this announcement? There is no way to undo this action.",
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
    <Container maxWidth={"md"} className={layout.page}>
      <BackButton href={"/admin/announcement"} text={"Back To Announcements"} />
      <Typography variant={"h1"} align={"center"}>
        Manage Announcement |{" "}
        <Typography variant="inherit" component={"span"} color="secondary">
          Admin Panel
        </Typography>
      </Typography>
      <AdminTabBar />
      {!isEditing && (
        <div className={layout.center}>
          <Stack direction={"row"} spacing={3}>
            <Button
              variant={"outlined"}
              color={"secondary"}
              onClick={() => setIsEditing(true)}
              startIcon={<Create />}
            >
              Edit Announcement
            </Button>
            <Button
              variant={"outlined"}
              startIcon={<Delete />}
              color={"warning"}
              onClick={handleDelete}
            >
              Delete Announcement
            </Button>
          </Stack>
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
    </Container>
  );
}
