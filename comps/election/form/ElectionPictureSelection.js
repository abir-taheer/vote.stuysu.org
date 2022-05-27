import { gql, useApolloClient } from "@apollo/client";
import AddAPhoto from "@mui/icons-material/AddAPhoto";
import Clear from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import uploadPicture from "../../../utils/upload/uploadPicture";
import alertDialog from "../../dialog/alertDialog";
import PictureUploadDialog, {
  promptPicture,
} from "../../shared/PictureUploadDialog";

const PICTURE_QUERY = gql`
  query ($id: ObjectID!) {
    pictureById(id: $id) {
      id
      alt
      resource {
        url
      }
    }
  }
`;

const styles = {
  image: {
    maxWidth: "300px",
    maxHeight: "300px",
    objectFit: "contain",
  },

  button: {
    margin: "0.5rem 0",
  },

  container: {
    margin: "0.5rem",
  },

  error: {
    fontSize: "12px",
  },
};

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

  useEffect(() => {
    const pictureNeedsUpdating = !picture || picture.id !== value;

    if (value && pictureNeedsUpdating && !loading) {
      setLoading(true);

      client
        .query({
          query: PICTURE_QUERY,
          variables: { id: value },
        })
        .then(({ data }) => {
          setPicture(data.pictureById);
          setLoading(false);
        });
    }
  }, [value, client, picture, loading]);

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
    <div style={styles.container}>
      <PictureUploadDialog />
      <FormLabel>Election Picture</FormLabel>
      <br />
      {loading && <CircularProgress />}
      {!loading && !!value && picture && (
        <>
          <img
            src={picture.resource.url}
            alt={picture.alt}
            style={styles.image}
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
          sx={styles.button}
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
          sx={styles.button}
          disabled={disabled}
        >
          Clear Picture
        </Button>
      )}
      {touched && !!error && (
        <Typography variant={"subtitle1"} sx={styles.error} color={"error"}>
          {error}
        </Typography>
      )}
    </div>
  );
};

export default ElectionPictureSelection;
