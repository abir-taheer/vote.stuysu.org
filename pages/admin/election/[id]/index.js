import { useContext, useState } from "react";
import AdminRequired from "../../../../comps/auth/AdminRequired";
import layout from "../../../../styles/layout.module.css";
import styles from "../../../../styles/Elections.module.css";
import Typography from "@material-ui/core/Typography";
import AdminTabBar from "../../../../comps/admin/AdminTabBar";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import withApollo from "../../../../comps/apollo/withApollo";
import ElectionNotFound from "../../../../comps/election/ElectionNotFound";
import BackButton from "../../../../comps/shared/BackButton";
import AdminElectionTabBar from "../../../../comps/admin/AdminElectionTabBar";
import ElectionForm from "../../../../comps/election/ElectionForm";
import moment from "moment-timezone";
import Button from "@material-ui/core/Button";
import Create from "@material-ui/icons/Create";
import alertDialog from "../../../../comps/dialog/alertDialog";
import { useSnackbar } from "notistack";
import useElectionById from "../../../../comps/election/useElectionById";
import DeleteForever from "@material-ui/icons/DeleteForever";
import confirmDialog from "../../../../comps/dialog/confirmDialog";
import DateContext from "../../../../comps/shared/DateContext";
import Lock from "@material-ui/icons/Lock";
import LockOpen from "@material-ui/icons/LockOpen";

const EDIT_MUTATION = gql`
  mutation(
    $id: ObjectId!
    $name: NonEmptyString!
    $url: NonEmptyString!
    $pictureId: ObjectId!
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
  mutation($id: ObjectId!) {
    completeElection(id: $id) {
      id
      completed
    }
  }
`;

const OPEN_MUTATION = gql`
  mutation($id: ObjectId!) {
    openElection(id: $id) {
      id
      completed
    }
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
              The election hasn't ended yet and will end on{" "}
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
    <AdminRequired>
      <div className={layout.container}>
        <main className={layout.main}>
          <BackButton href={"/admin/election"} text={"Back To Elections"} />
          <Typography variant={"h1"} align={"center"}>
            Manage Election | Admin Panel
          </Typography>
          <AdminTabBar />

          {!election && <ElectionNotFound href={"/admin/election"} />}

          {!!election && (
            <>
              <Typography variant={"h2"} color={"secondary"}>
                {election.name}
              </Typography>
              {election.completed && (
                <Typography variant={"body1"} color={"primary"}>
                  This election has been closed and changes cannot be made
                </Typography>
              )}
              <AdminElectionTabBar />
              {!election.completed && !editing && (
                <div>
                  <Button
                    variant={"outlined"}
                    color={"secondary"}
                    onClick={() => setEditing(true)}
                    startIcon={<Create />}
                    className={styles.electionChangeButton}
                  >
                    Edit Election
                  </Button>
                  <Button
                    variant={"outlined"}
                    color={"primary"}
                    onClick={handleCloseElection}
                    startIcon={<Lock />}
                    className={styles.electionChangeButton}
                  >
                    Close Election
                  </Button>

                  <Button
                    variant={"outlined"}
                    onClick={() => setEditing(true)}
                    startIcon={<DeleteForever />}
                    className={styles.deleteElectionButton}
                  >
                    Delete Election
                  </Button>
                </div>
              )}

              {election.completed && (
                <Button
                  variant={"outlined"}
                  onClick={handleOpenElection}
                  startIcon={<LockOpen />}
                >
                  Reopen Election
                </Button>
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
        </main>
      </div>
    </AdminRequired>
  );
};

export default withApollo({ ssr: false })(ManageElection);
