import { gql, useMutation } from "@apollo/client";
import Create from "@mui/icons-material/Create";
import DeleteForever from "@mui/icons-material/DeleteForever";
import Lock from "@mui/icons-material/Lock";
import LockOpen from "@mui/icons-material/LockOpen";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import moment from "moment-timezone";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useContext, useState } from "react";
import AdminElectionTabBar from "../../../../comps/admin/AdminElectionTabBar";
import AdminTabBar from "../../../../comps/admin/AdminTabBar";
import alertDialog from "../../../../comps/dialog/alertDialog";
import confirmDialog from "../../../../comps/dialog/confirmDialog";
import ElectionNotFound from "../../../../comps/election/ElectionNotFound";
import ElectionForm from "../../../../comps/election/form/ElectionForm";
import useElectionById from "../../../../comps/election/useElectionById";
import BackButton from "../../../../comps/shared/BackButton";
import CenteredCircularProgress from "../../../../comps/shared/CenteredCircularProgress";
import DateContext from "../../../../comps/shared/DateContext";
import layout from "../../../../styles/layout.module.css";

const EDIT_MUTATION = gql`
  mutation (
    $id: ObjectID!
    $name: NonEmptyString!
    $url: NonEmptyString!
    $pictureId: ObjectID!
    $type: ElectionType!
    $allowedGradYears: [PositiveInt!]!
    $start: DateTime!
    $end: DateTime!
  ) {
    editElection(
      id: $id
      name: $name
      url: $url
      pictureId: $pictureId
      type: $type
      allowedGradYears: $allowedGradYears
      start: $start
      end: $end
    ) {
      id
      name
      url
      picture {
        id
        alt
        resource {
          id
          url
        }
      }
      allowedGradYears
      type
      start
      end
      completed
    }
  }
`;

const CLOSE_MUTATION = gql`
  mutation ($id: ObjectID!) {
    completeElection(id: $id) {
      id
      completed
    }
  }
`;

const OPEN_MUTATION = gql`
  mutation ($id: ObjectID!) {
    openElection(id: $id) {
      id
      completed
    }
  }
`;

const DELETE_MUTATION = gql`
  mutation ($id: ObjectID!) {
    deleteElection(id: $id)
  }
`;

const ManageElection = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = router.query;
  const { election, loading } = useElectionById(id);
  const dateContext = useContext(DateContext);

  const [editing, setEditing] = useState(false);
  const [updateElection] = useMutation(EDIT_MUTATION);
  const [closeElection] = useMutation(CLOSE_MUTATION, { variables: { id } });
  const [openElection] = useMutation(OPEN_MUTATION, { variables: { id } });

  const [remove] = useMutation(DELETE_MUTATION, { variables: { id } });

  const handleRemove = async () => {
    const confirmation = await confirmDialog({
      title: "Confirm Deletion",
      body: `Are you sure you want to delete ${election.name}? This action cannot be undone?`,
    });

    if (confirmation) {
      try {
        await remove();
        enqueueSnackbar("The election was successfully deleted", {
          variant: "success",
        });
        await router.push("/admin/election");
      } catch (e) {
        await alertDialog({
          title: "Error removing election",
          body: e.message,
        });
      }
    }
  };

  async function handleOpenElection() {
    const confirmation = await confirmDialog({
      title: "Are you sure you want to reopen the election?",
      body: (
        <div>
          <Typography variant={"body1"}>
            Reopening the election will prevent students from seeing the
            results.
          </Typography>

          <Typography variant={"body1"}>
            It will also make it possible to start collecting votes again.
          </Typography>

          <Typography variant={"h3"} color={"error"}>
            DO NOT reopen elections unless there is a valid reason for doing so
          </Typography>
        </div>
      ),
    });

    if (confirmation) {
      await openElection();
      enqueueSnackbar("The election was successfully reopened", {
        variant: "success",
      });
    }
  }

  async function handleCloseElection() {
    let confirmation = await confirmDialog({
      title: "Are you sure?",
      body: (
        <div>
          <Typography variant={"body1"}>
            Closing this election means that no new votes will be recorded and
            results will be made publicly available.
          </Typography>

          <Typography variant={"body1"}>
            Only do this once you are ready to share the results of the election
            with students.
          </Typography>
        </div>
      ),
    });

    const end = new Date(election.end);

    if (confirmation && dateContext.getNow() < end) {
      confirmation = await confirmDialog({
        title: "The election isn't over yet, are you really sure?",
        body: (
          <div>
            <Typography variant={"body1"}>
              The election hasn&apos;t ended yet and will end on{" "}
              <b>
                {moment(end)
                  .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                  .format("LLLL z")}
              </b>
              .
            </Typography>
            <Typography variant={"body1"}>
              Are you really sure you want to close this election?
            </Typography>
          </div>
        ),
      });
    }
    if (confirmation) {
      await closeElection();
      enqueueSnackbar("The election was successfully closed", {
        variant: "success",
      });
    }
  }

  async function handleSave(
    { name, url, pictureId, type, allowedGradYears, start, end },
    { setSubmitting }
  ) {
    const variables = {
      id,
      name,
      url,
      pictureId,
      type,
      allowedGradYears,
      start: new Date(start),
      end: new Date(end),
    };

    try {
      await updateElection({ variables });
      setEditing(false);
      enqueueSnackbar("Successfully updated election", { variant: "success" });
    } catch (er) {
      await alertDialog({ title: "Error editing election", body: er.message });
    }
    setSubmitting(false);
  }

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <BackButton href={"/admin/election"} text={"Back To Elections"} />
      <Typography variant={"h1"} align={"center"}>
        Manage Election |{" "}
        <Typography variant="inherit" component={"span"} color="secondary">
          Admin Panel
        </Typography>
      </Typography>

      <AdminTabBar />

      {loading && <CenteredCircularProgress />}

      {!loading && !!id && !election && (
        <ElectionNotFound href={"/admin/election"} />
      )}

      {!!election && (
        <>
          <Typography variant={"h2"} color={"secondary"} align={"center"}>
            {election.name}
          </Typography>
          {election.completed && (
            <Typography variant={"body1"} color={"primary"} align={"center"}>
              This election has been closed and changes cannot be made
            </Typography>
          )}

          <AdminElectionTabBar />

          {!election.completed && !editing && (
            <div className={layout.center}>
              <Stack direction={"row"} spacing={3}>
                <Button
                  variant={"outlined"}
                  color={"secondary"}
                  onClick={() => setEditing(true)}
                  startIcon={<Create />}
                >
                  Edit Election
                </Button>
                <Button
                  variant={"outlined"}
                  color={"primary"}
                  onClick={handleCloseElection}
                  startIcon={<Lock />}
                >
                  Close Election
                </Button>

                <Button
                  variant={"outlined"}
                  onClick={handleRemove}
                  startIcon={<DeleteForever />}
                  color={"warning"}
                >
                  Delete Election
                </Button>
              </Stack>
            </div>
          )}

          {election.completed && (
            <div className={layout.center}>
              <Button
                variant={"outlined"}
                onClick={handleOpenElection}
                startIcon={<LockOpen />}
              >
                Reopen Election
              </Button>
            </div>
          )}

          <ElectionForm
            disabled={!editing || loading}
            initialValues={{
              name: election.name,
              url: election.url,
              type: election.type,
              pictureId: election.picture.id,
              start: moment(election.start).format("YYYY-MM-DDTHH:mm"),
              end: moment(election.end).format("YYYY-MM-DDTHH:mm"),
              allowedGradYears: election.allowedGradYears,
            }}
            submitLabel={"Save"}
            showCancelButton
            onCancel={({ resetForm }) => {
              setEditing(false);
              resetForm();
            }}
            onSubmit={handleSave}
          />
        </>
      )}
    </Container>
  );
};

export default ManageElection;
