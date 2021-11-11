import { gql, useMutation, useQuery } from "@apollo/client";
import { getDataFromTree } from "@apollo/client/react/ssr";
import AddPhotoAlternateOutlined from "@mui/icons-material/AddPhotoAlternateOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import withApollo from "../../../../../comps/apollo/withApollo";
import CandidateTabBar from "../../../../../comps/candidate/CandidateTabBar";
import ProfileChangeCard from "../../../../../comps/candidate/ProfileChangeCard";
import confirmDialog from "../../../../../comps/dialog/confirmDialog";
import BackButton from "../../../../../comps/shared/BackButton";
import LoadingScreen from "../../../../../comps/shared/LoadingScreen";
import PictureUploadDialog, {
  promptPicture,
} from "../../../../../comps/shared/PictureUploadDialog";
import TinyEditor from "../../../../../comps/shared/TinyEditor";
import uploadPicture from "../../../../../utils/upload/uploadPicture";
import Error404 from "../../../../404";
import layout from "./../../../../../styles/layout.module.css";

const QUERY = gql`
  query ($candidateUrl: NonEmptyString!, $electionUrl: NonEmptyString!) {
    candidateByUrl(url: $candidateUrl, election: { url: $electionUrl }) {
      id
      name
      blurb
      platform
      picture {
        id
        alt
        resource {
          height
          width
          url
        }
      }
      isManager
      totalStrikes
      active

      profileChanges {
        ... on CandidateProfileStringChange {
          id

          createdBy {
            name
            email
          }

          field
          value

          reviewed
          reviewedBy {
            name
            email
          }
          approved
          reasonForRejection

          createdAt
          reviewedAt
          updatedAt
          candidate {
            name
            picture {
              alt
              resource {
                width
                height
                url
              }
            }
          }
        }

        ... on CandidateProfilePictureChange {
          id

          createdBy {
            name
            email
          }

          field
          picture {
            id
            alt
            resource {
              height
              width
              url
            }
          }

          reviewed
          reviewedBy {
            name
            email
          }
          approved
          reasonForRejection

          createdAt
          reviewedAt
          updatedAt
          candidate {
            name
            picture {
              alt
              resource {
                width
                height
                url
              }
            }
          }
        }
      }
    }
    electionByUrl(url: $electionUrl) {
      id
      name
      completed
    }
  }
`;

const DELETE_MUTATION = gql`
  mutation ($id: ObjectID!) {
    deleteCandidateProfileChange(id: $id)
  }
`;

const REQUEST_MUTATION = gql`
  mutation (
    $candidateId: ObjectID!
    $pictureId: ObjectID
    $blurb: String
    $platform: String
  ) {
    requestCandidateProfileChange(
      candidateId: $candidateId
      blurb: $blurb
      pictureId: $pictureId
      platform: $platform
    ) {
      __typename
    }
  }
`;

function CandidateManagePage() {
  const router = useRouter();
  const { url, candidateUrl } = router.query;
  const [uploading, setUploading] = useState(false);
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: {
      electionUrl: url,
      candidateUrl,
    },
    skip: !candidateUrl || !url,
  });
  const [request, { loading: requesting }] = useMutation(REQUEST_MUTATION);
  const changesRef = useRef();

  const { setFieldValue, values } = useFormik({
    initialValues: {
      editingPlatform: false,
      platform: "",
      editingBlurb: false,
      blurb: "",
    },
    validateOnChange: false,
  });

  const [remove, { loading: removing }] = useMutation(DELETE_MUTATION);
  const { enqueueSnackbar } = useSnackbar();

  const election = data?.electionByUrl;
  const candidate = data?.candidateByUrl;

  useEffect(() => {
    if (!values.blurb && !values.platform && candidate) {
      setFieldValue("blurb", candidate.blurb || "");
      setFieldValue("platform", candidate.platform || "");
    }
  }, [data, setFieldValue, values, candidate]);

  const handleCancel = async (id) => {
    const confirmation = await confirmDialog({
      title: "Are you sure you want to cancel?",
      body: "These changes will be lost and cannot be restored. Are you sure you want to cancel the request?",
    });

    if (confirmation) {
      try {
        await remove({ variables: { id } });
        enqueueSnackbar("Request successfully cancelled", {
          variant: "success",
        });
        await refetch();
      } catch (e) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  if (error) {
    return (
      <Typography variant={"body1"} color={"error"} align={"center"}>
        {error.message}
      </Typography>
    );
  }

  if (loading || !candidateUrl || !url) {
    return <LoadingScreen />;
  }

  if (!data || !candidate || !election) {
    return <Error404 />;
  }

  const title = `Manage ${candidate.name} | StuyBOE Voting Site`;

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <Head>
        <title>{title}</title>
        <meta property={"og:title"} content={title} />
        <meta
          property={"description"}
          content={"Manage the candidate page for " + candidate.name}
        />
        <meta
          property="og:description"
          content={"Manage the candidate page for " + candidate.name}
        />
        <meta property="og:image" content={candidate.picture.resource?.url} />
        <meta property="og:image:alt" content={candidate.picture.alt} />
        <meta
          property="og:image:height"
          content={candidate.picture.resource.height}
        />
        <meta
          property="og:image:width"
          content={candidate.picture.resource.width}
        />
        <meta
          property="og:image:type"
          content={
            candidate.picture.resource.resourceType +
            "/" +
            candidate.picture.resource.format
          }
        />
      </Head>

      <BackButton
        href={"/election/" + election.url + "/candidate"}
        variant={"outlined"}
        text={election.name}
      />

      <div className={layout.center}>
        <Image
          src={candidate.picture.resource.url}
          alt={candidate.picture.alt}
          height={200}
          width={200}
          className={layout.candidatePicture}
        />
      </div>

      <Typography variant={"h1"} className={layout.title} color={"primary"}>
        {candidate.name}
      </Typography>

      <CandidateTabBar
        isManager={candidate.isManager}
        electionCompleted={election.completed}
        active={candidate.active}
        strikes={candidate.totalStrikes}
      />

      <PictureUploadDialog />
      <LoadingButton
        startIcon={<AddPhotoAlternateOutlined />}
        loading={uploading}
        loadingPosition={"center"}
        variant={"outlined"}
        color={"secondary"}
        sx={{ margin: "2rem 0" }}
        onClick={async () => {
          const image = await promptPicture();

          try {
            if (image) {
              setUploading(true);

              const { data } = await uploadPicture(image.file, image.alt);
              await request({
                variables: {
                  candidateId: candidate.id,
                  pictureId: data.id,
                },
              });

              enqueueSnackbar(
                "Successfully uploaded image. Awaiting approval",
                { variant: "success" }
              );
              await refetch();
              changesRef?.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          } catch (e) {
            enqueueSnackbar(e.message, { variant: "error" });
          } finally {
            setUploading(false);
          }
        }}
      >
        Upload New Image
      </LoadingButton>

      <Typography variant={"h3"}>Candidate Summary / Blurb</Typography>
      <Typography variant={"body2"} color={"text.secondary"}>
        Try to summarize your candidacy in a short tweet (less than 200
        characters). This is the text that will show up in the preview when you
        share your candidate page on social media. Don&apos;t add any links here
        but instead add them in the platform field that&apos;s below this.
      </Typography>
      <TextField
        value={values.blurb}
        onChange={(e) => setFieldValue("blurb", e.target.value.substr(0, 200))}
        variant={"outlined"}
        label={"Candidate Blurb / Summary"}
        disabled={!values.editingBlurb}
        onClick={() => {
          if (!values.editingBlurb) {
            setFieldValue("editingBlurb", true);
          }
        }}
        helperText={
          !values.editingBlurb
            ? "Click to edit"
            : "(" + values.blurb.length + "/200)"
        }
        fullWidth
        multiline
        rows={3}
        sx={{ marginBottom: "1rem" }}
      />

      {values.editingBlurb && (
        <Stack direction={"row"} spacing={2} sx={{ marginBottom: "2rem" }}>
          <Button
            variant={"contained"}
            color={"secondary"}
            disabled={requesting}
            onClick={() => {
              request({
                variables: {
                  candidateId: candidate.id,
                  blurb: values.blurb,
                },
              })
                .then(() => {
                  enqueueSnackbar(
                    "Successfully requested change. Waiting for approval",
                    { variant: "success" }
                  );
                  refetch();
                  setFieldValue("editingBlurb", false);
                  changesRef?.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                })
                .catch((e) => enqueueSnackbar(e.message, { variant: "error" }));
            }}
          >
            Save
          </Button>
          <Button
            color={"warning"}
            variant={"outlined"}
            disabled={requesting}
            onClick={() => {
              setFieldValue("blurb", candidate.blurb || "");
              setFieldValue("editingBlurb", false);
            }}
          >
            Cancel
          </Button>
        </Stack>
      )}

      <Typography variant={"h3"}>Candidate Platform</Typography>
      <Typography variant={"body2"} color={"text.secondary"}>
        Here you can go over your candidacy in more detail, as well as include
        any relevant links, photos, or embed videos from youtube.
      </Typography>
      <div style={{ position: "relative" }}>
        {!values.editingPlatform && (
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              background: "rgba(0, 0, 0, 0.05)",
              zIndex: 100,
            }}
            onClick={() => {
              if (!values.editingPlatform) {
                setFieldValue("editingPlatform", true);
              }
            }}
          />
        )}
        <TinyEditor
          style={{ marginTop: "1rem", marginBottom: "0.5rem" }}
          value={values.platform}
          setValue={(v) => setFieldValue("platform", v.substr(0, 10000))}
          variant={"outlined"}
          label={"Candidate Platform / Policies"}
          disabled={!values.editingPlatform}
          helperText={!values.editingPlatform ? "Click to edit" : ""}
        />
      </div>

      {!values.editingPlatform && (
        <Typography variant={"body2"} color={"text.secondary"}>
          Click to edit
        </Typography>
      )}

      {values.editingPlatform && (
        <Stack direction={"row"} spacing={2}>
          <Button
            variant={"contained"}
            color={"secondary"}
            disabled={requesting}
            onClick={() => {
              request({
                variables: {
                  candidateId: candidate.id,
                  platform: values.platform,
                },
              })
                .then(() => {
                  enqueueSnackbar(
                    "Successfully requested change. Waiting for approval",
                    { variant: "success" }
                  );
                  refetch();
                  setFieldValue("editingPlatform", false);
                  changesRef?.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                })
                .catch((e) => enqueueSnackbar(e.message, { variant: "error" }));
            }}
          >
            Save
          </Button>
          <Button
            color={"warning"}
            variant={"outlined"}
            disabled={requesting}
            onClick={() => {
              setFieldValue("platform", candidate.platform || "");
              setFieldValue("editingPlatform", false);
            }}
          >
            Cancel
          </Button>
        </Stack>
      )}

      <Typography variant={"h3"} align={"center"} ref={changesRef}>
        Changes History:
      </Typography>

      <Stack direction={"column"} spacing={3}>
        {candidate.profileChanges.map((change) => (
          <ProfileChangeCard
            {...change}
            key={change.id}
            showCancelButton={!change.reviewed}
            disabled={removing}
            onCancel={() => handleCancel(change.id)}
          />
        ))}
      </Stack>
    </Container>
  );
}

export default withApollo(CandidateManagePage, { getDataFromTree });
