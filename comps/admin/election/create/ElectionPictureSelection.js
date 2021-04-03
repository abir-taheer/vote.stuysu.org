import React, { useEffect, useState } from "react";
import PictureUploadDialog, {
  promptPicture,
} from "../../../shared/PictureUploadDialog";
import Button from "@material-ui/core/Button";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import alertDialog from "../../../dialog/alertDialog";
import withApollo from "../../../apollo/withApollo";

const PICTURE_QUERY = gql`
  query($id: ObjectId!) {
    pictureById(id: $id) {
      id
      alt
      resource {
        url
      }
    }
  }
`;

const UPLOAD_MUTATION = gql`
  mutation($alt: String!, $file: Upload!) {
    uploadPicture(alt: $alt, file: $file) {
      id
    }
  }
`;

const ElectionPictureSelection = ({ value, setValue }) => {
  const [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState(null);
  const [upload] = useMutation(UPLOAD_MUTATION);
  const client = useApolloClient();

  useEffect(async () => {
    const pictureNeedsUpdating = !picture || picture.id !== value;
    if (value && pictureNeedsUpdating) {
      setLoading(true);

      const { data } = await client.query({
        query: PICTURE_QUERY,
        variables: { id: value },
      });

      setPicture(data.pictureById);
      setLoading(false);
    }
  }, [value]);

  const uploadPicture = async () => {
    const pictureInput = await promptPicture();

    if (pictureInput) {
      setLoading(true);
      try {
        const { data } = await upload({ variables: pictureInput });

        setValue(data.uploadPicture.id);
      } catch (er) {
        await alertDialog({ title: "There was an error", body: er.message });
      }

      setLoading(false);
    }
  };

  return (
    <div>
      <PictureUploadDialog />
      {picture && <img src={picture.resource.url} alt={picture.alt} />}
      <Button onClick={uploadPicture}>Upload Picture</Button>
    </div>
  );
};

export default withApollo({ ssr: false })(ElectionPictureSelection);
