import { gql, useMutation, useQuery } from "@apollo/client";
import BlockOutlined from "@mui/icons-material/BlockOutlined";
import Create from "@mui/icons-material/Create";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import ReplayOutlined from "@mui/icons-material/ReplayOutlined";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import StyledLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import AdminCandidateTabBar from "../../../../comps/admin/AdminCandidateTabBar";
import AdminTabBar from "../../../../comps/admin/AdminTabBar";
import CandidateForm from "../../../../comps/candidate/form/CandidateForm";
import alertDialog from "../../../../comps/dialog/alertDialog";
import confirmDialog from "../../../../comps/dialog/confirmDialog";
import ElectionNotFound from "../../../../comps/election/ElectionNotFound";
import BackButton from "../../../../comps/shared/BackButton";
import layout from "../../../../styles/layout.module.css";

const QUERY = gql`
  query ($id: ObjectID!) {
    candidateById(id: $id) {
      id
      name
      url
      blurb
      platform
      active
      managers {
        id
        name
        email
        gradYear
        grade
      }
      picture {
        id
        alt
        resource {
          url
        }
      }
      election {
        id
        name
        url
        completed
      }
    }
  }
`;

const MUTATION = gql`
  mutation (
    $id: ObjectID!
    $name: NonEmptyString!
    $url: NonEmptyString!
    $blurb: String!
    $platform: String!
    $managerIds: [ObjectID!]!
    $pictureId: ObjectID
  ) {
    editCandidate(
      id: $id
      name: $name
      url: $url
      blurb: $blurb
      platform: $platform
      managerIds: $managerIds
      pictureId: $pictureId
    ) {
      id
      name
      url
      blurb
      platform
      active
      managers {
        id
        name
        email
        gradYear
        grade
      }
      picture {
        id
        alt
        resource {
          url
        }
      }
    }
  }
`;

const DELETE_MUTATION = gql`
  mutation ($id: ObjectID!) {
    deleteCandidate(id: $id)
  }
`;

const SET_ACTIVE_MUTATION = gql`
  mutation ($id: ObjectID!, $active: Boolean!) {
    setCandidateActive(id: $id, active: $active) {
      id
      active
    }
  }
`;

const ManageCandidate = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);
  const { id } = router.query;
  const { data, loading } = useQuery(QUERY, { variables: { id } });
  const [edit] = useMutation(MUTATION);
  const [setCandidateActive, { loading: settingActive }] =
    useMutation(SET_ACTIVE_MUTATION);
  const [remove, { loading: removing }] = useMutation(DELETE_MUTATION, {
    variables: { id },
  });

  const candidate = data?.candidateById;
  const election = candidate?.election;

  const handleRemove = async () => {
    const confirmation = await confirmDialog({
      title: "Confirm Deletion",
      body: "Are you sure you want to delete this candidate? This action cannot be undone.",
    });

    if (confirmation) {
      try {
        await remove();

        enqueueSnackbar("Successfully deleted the candidate", {
          variant: "success",
        });

        await router.push("/admin/election/" + election.id + "/candidate");
      } catch (e) {
        await alertDialog({
          title: "Error removing candidate",
          body: e.message,
        });
      }
    }
  };

  const handleSave = async (
    { name, url, blurb, platform, managers, picture },
    { setSubmitting }
  ) => {
    const managerIds = managers.map((a) => a.id);
    const pictureId = picture?.id;

    try {
      await edit({
        variables: {
          id,
          name,
          url,
          blurb,
          platform,
          managerIds,
          pictureId,
        },
      });
      setSubmitting(false);
      setIsEditing(false);

      enqueueSnackbar("Your changes were saved successfully", {
        variant: "success",
      });
    } catch (e) {
      alertDialog({
        title: "Could not save edits",
        body: "There was an error: " + e.message,
      });
    }
  };

  const handleModifyCandidateActive = async (active) => {
    const message = candidate.active
      ? "Suspending a candidate should happen when a candidate has too many strikes but may still appeal and get the strikes removed. If the candidate has dropped out or will no longer be able to run you should delete them instead. Are you sure you want to suspend this candidate?"
      : "Are you sure you want to reinstate this candidate? ";

    const confirmation = await confirmDialog({
      title: "Confirm Action",
      body: message,
    });

    if (confirmation) {
      try {
        await setCandidateActive({ variables: { id, active } });
        enqueueSnackbar("Your changes were saved successfully", {
          variant: "success",
        });
      } catch (e) {
        alertDialog({
          title: "Could not perform that action",
          body: "There was an error: " + e.message,
        });
      }
    }
  };

  return (
    <Container maxWidth={"md"} className={layout.page}>
      {election && (
        <BackButton
          href={"/admin/election/" + election?.id + "/candidate"}
          text={election?.name + " Candidates"}
        />
      )}

      <Typography variant={"h1"} align={"center"}>
        Manage Candidate |{" "}
        <Typography variant="inherit" component={"span"} color="secondary">
          Admin Panel
        </Typography>
      </Typography>

      <AdminTabBar />

      {loading && <CircularProgress />}

      {!loading && !candidate && <ElectionNotFound href={"/admin/election"} />}

      {!loading && !!candidate && (
        <>
          <Typography variant={"h2"} color={"secondary"} align={"center"}>
            {candidate.name}
          </Typography>

          <Typography variant={"body1"} align={"center"}>
            Candidate for{" "}
            <Link href={"/admin/election/" + election.id} passHref>
              <StyledLink color={"secondary"} className={layout.link}>
                {election.name}
              </StyledLink>
            </Link>
          </Typography>
          {!candidate.active && (
            <Typography align={"center"} color={"error"} paragraph>
              <b>This candidate has been suspended</b>
            </Typography>
          )}

          <AdminCandidateTabBar />
          {!isEditing && election.completed && (
            <Typography
              gutterBottom
              align={"center"}
              variant={"body1"}
              color={"text.secondary"}
            >
              The election is closed and so deleting/suspending/reinstating
              candidates is blocked
            </Typography>
          )}

          {!isEditing && (
            <div className={layout.center}>
              <Button
                className={layout.spaced}
                variant={"outlined"}
                color={"secondary"}
                startIcon={<Create />}
                onClick={() => setIsEditing(true)}
              >
                Edit Candidate
              </Button>

              {candidate.active ? (
                <Button
                  className={layout.spaced}
                  variant={"outlined"}
                  disabled={settingActive || election.completed}
                  color={"warning"}
                  startIcon={<BlockOutlined />}
                  onClick={() => handleModifyCandidateActive(false)}
                >
                  Suspend Candidate
                </Button>
              ) : (
                <Button
                  className={layout.spaced}
                  variant={"outlined"}
                  color={"warning"}
                  disabled={settingActive || election.completed}
                  startIcon={<ReplayOutlined />}
                  onClick={() => handleModifyCandidateActive(true)}
                >
                  Reinstate Candidate
                </Button>
              )}

              <Button
                className={layout.spaced}
                variant={"outlined"}
                color={"error"}
                startIcon={<DeleteOutlined />}
                disabled={election.completed}
                onClick={handleRemove}
              >
                Delete Candidate
              </Button>
            </div>
          )}
          <br />

          <CandidateForm
            election={election}
            initialValues={candidate}
            submitLabel={"Save"}
            showCancelButton
            onCancel={({ resetForm }) => {
              resetForm();
              setIsEditing(false);
            }}
            disabled={!isEditing}
            onSubmit={handleSave}
          />
        </>
      )}
    </Container>
  );
};

export default ManageCandidate;
