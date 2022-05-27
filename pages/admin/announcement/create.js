import { gql, useMutation } from "@apollo/client";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import React from "react";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import AnnouncementForm from "../../../comps/announcement/form/AnnouncementForm";
import alertDialog from "../../../comps/dialog/alertDialog";
import BackButton from "../../../comps/shared/BackButton";
import layout from "./../../../styles/layout.module.css";

const MUTATION = gql`
  mutation (
    $title: NonEmptyString!
    $body: NonEmptyString!
    $start: DateTime
    $end: DateTime
    $permanent: Boolean!
    $showOnHome: Boolean!
    $electionId: ObjectID
  ) {
    createAnnouncement(
      title: $title
      body: $body
      start: $start
      end: $end
      permanent: $permanent
      showOnHome: $showOnHome
      electionId: $electionId
    ) {
      id
    }
  }
`;

const CreateAnnouncement = () => {
  const router = useRouter();
  const [submit, { loading }] = useMutation(MUTATION);

  const handleSubmit = async (
    { title, body, start, end, permanent, showOnHome, election },
    { setSubmitting }
  ) => {
    try {
      const { data } = await submit({
        variables: {
          title,
          body,
          start,
          end,
          permanent,
          showOnHome,
          electionId: election?.id,
        },
      });

      await router.push("/admin/announcement/" + data.createAnnouncement.id);
    } catch (e) {
      await alertDialog({
        title: "Error",
        body: "There was an error creating the announcement: " + e.message,
      });
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <BackButton href={"/admin/announcement"} text={"Back To Announcements"} />

      <Typography variant={"h1"} align={"center"}>
        Create Announcement |{" "}
        <Typography variant="inherit" component={"span"} color="secondary">
          Admin Panel
        </Typography>
      </Typography>

      <AdminTabBar />

      <AnnouncementForm
        onSubmit={handleSubmit}
        submitLabel={"Create"}
        disabled={loading}
      />
    </Container>
  );
};

export default CreateAnnouncement;
