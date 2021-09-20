import React, { useEffect, useState } from "react";
import PictureUploadDialog, {
  promptPicture,
} from "../shared/PictureUploadDialog";
import Button from "@material-ui/core/Button";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import alertDialog from "../dialog/alertDialog";
import withApollo from "../apollo/withApollo";
import AddAPhoto from "@material-ui/icons/AddAPhoto";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "./ElectionPictureSelection.module.css";
import FormLabel from "@material-ui/core/FormLabel";
import Clear from "@material-ui/icons/Clear";
import Typography from "@material-ui/core/Typography";
import uploadPicture from "../../utils/upload/uploadPicture";

const PICTURE_QUERY = gql`
  query ($id: ObjectId!) {
    pictureById(id: $id) {
      id
      alt
      resource {
        url
      }
    }
  }
`;

const ElectionPictureSelection = ({
  value,
  setValue,
  touched,
  error,
  disabled,
}) => {
  const [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState(null);
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

  const handleUpload = async () => {
    const pictureInput = await promptPicture();

    if (pictureInput) {
      setLoading(true);
      const { file, alt } = pictureInput;
      try {
        const { data } = await uploadPicture(file, alt);

        setValue(data.id);
      } catch (er) {
        await alertDialog({ title: "There was an error", body: er.message });
      }

      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <PictureUploadDialog />
      <FormLabel>Election Picture</FormLabel>
      <br />
      {loading && <CircularProgress />}
      {!loading && !!value && picture && (
        <>
          <img
            src={picture.resource.url}
            alt={picture.alt}
            className={styles.image}
          />
          <br />
        </>
      )}
      {!loading && !value && (
        <Button
          startIcon={<AddAPhoto />}
          onClick={handleUpload}
          variant={"outlined"}
          color={"primary"}
          className={styles.button}
          disabled={disabled}
        >
          Upload Election Picture
        </Button>
      )}
      {!loading && !!value && (
        <Button
          startIcon={<Clear />}
          onClick={() => setValue(null)}
          variant={"outlined"}
          color={"secondary"}
          className={styles.button}
          disabled={disabled}
        >
          Clear Picture
        </Button>
      )}
      {touched && !!error && (
        <Typography
          variant={"subtitle1"}
          className={styles.error}
          color={"error"}
        >
          {error}
        </Typography>
      )}
    </div>
  );
};

export default withApollo({ ssr: false })(ElectionPictureSelection);
