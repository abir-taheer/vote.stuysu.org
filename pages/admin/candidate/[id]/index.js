import layout from "../../../../styles/layout.module.css";
import { useRouter } from "next/router";
import { gql, useMutation, useQuery } from "@apollo/client";
import Typography from "@material-ui/core/Typography";
import AdminTabBar from "../../../../comps/admin/AdminTabBar";
import CircularProgress from "@material-ui/core/CircularProgress";
import ElectionNotFound from "../../../../comps/election/ElectionNotFound";
import CandidateForm from "../../../../comps/candidate/CandidateForm";
import Link from "next/link";
import StyledLink from "@material-ui/core/Link";
import React, { useState } from "react";
import AdminCandidateTabBar from "../../../../comps/admin/AdminCandidateTabBar";
import Button from "@material-ui/core/Button";
import Create from "@material-ui/icons/Create";
import alertDialog from "../../../../comps/dialog/alertDialog";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import BackButton from "../../../../comps/shared/BackButton";

const QUERY = gql`
  query ($id: ObjectId!) {
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
      }
    }
  }
`;

const MUTATION = gql`
  mutation (
    $id: ObjectId!
    $name: NonEmptyString!
    $url: NonEmptyString!
    $blurb: String!
    $platform: String!
    $managerIds: [ObjectId!]!
    $pictureId: ObjectId
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

const ManageCandidate = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);
  const { id } = router.query;
  const { data, loading } = useQuery(QUERY, { variables: { id } });
  const [edit] = useMutation(MUTATION);

  const candidate = data?.candidateById;
  const election = candidate?.election;

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

  return (
    <Container maxWidth={"md"} className={layout.page}>
      {election && (
        <BackButton
          href={"/admin/election/" + election?.id + "/candidate"}
          text={election?.name + " Candidates"}
        />
      )}

      <Typography variant={"h1"} align={"center"}>
        Manage Candidate | Admin Panel
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

          <AdminCandidateTabBar />

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

              {candidate.active && (
                <Button className={layout.spaced} variant={"outlined"}>
                  Suspend Candidate
                </Button>
              )}

              <Button className={layout.spaced} variant={"outlined"}>
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
