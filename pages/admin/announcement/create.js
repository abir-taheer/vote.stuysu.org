import React, { useState } from "react";
import AdminRequired from "../../../comps/auth/AdminRequired";
import { gql, useMutation, useQuery } from "@apollo/client";
import layout from "./../../../styles/layout.module.css";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import Typography from "@material-ui/core/Typography";
import BackButton from "../../../comps/shared/BackButton";
import AnnouncementForm from "../../../comps/announcement/AnnouncementForm";
import alertDialog from "../../../comps/dialog/alertDialog";
import { useRouter } from "next/router";

const MUTATION = gql`
  mutation(
    $title: NonEmptyString!
    $body: NonEmptyString!
    $start: DateTime
    $end: DateTime
    $permanent: Boolean!
    $showOnHome: Boolean!
    $electionId: ObjectId
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
    <AdminRequired>
      <div className={layout.container}>
        <main className={layout.main}>
          <BackButton
            href={"/admin/announcement"}
            text={"Back To Announcements"}
          />

          <Typography variant={"h1"} align={"center"}>
            Create Announcement | Admin Panel
          </Typography>

          <AdminTabBar />

          <AnnouncementForm
            onSubmit={handleSubmit}
            submitLabel={"Create"}
            disabled={loading}
          />
        </main>
      </div>
    </AdminRequired>
  );
};

export default CreateAnnouncement;
