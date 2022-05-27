import { gql, useQuery } from "@apollo/client";
import AddAPhoto from "@mui/icons-material/AddAPhoto";
import Clear from "@mui/icons-material/Clear";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import React, { useState } from "react";
import getDefaultCandidatePic from "../../../utils/candidate/getDefaltCandidatePic";
import uploadPicture from "../../../utils/upload/uploadPicture";
import alertDialog from "../../dialog/alertDialog";
import PictureUploadDialog, {
  promptPicture,
} from "../../shared/PictureUploadDialog";
import TinyEditor from "../../shared/TinyEditor";
import getCandidateUrl from "./getCandidateUrl";

const QUERY_USERS = gql`
  query ($query: String!) {
    allUsers(query: $query, resultsPerPage: 20) {
      results {
        id
        name
        email
        gradYear
        grade
      }
    }
  }
`;

const styles = {
  form: {
    maxWidth: "1200px",
  },
  nameControl: {
    "@media (min-width: 800px)": {
      marginRight: "1rem",
      width: "calc(100% - (1rem + 282px))",
    },

    "@media (max-width: 799px)": {
      width: "100%",
    },
  },

  urlControl: {
    "@media (min-width: 800px)": {
      width: "282px",
    },

    "@media (max-width: 799px)": {
      width: "100%",
    },
  },

  chip: {
    margin: "0.5rem",
  },

  submitButton: {
    margin: "0.5rem",
  },

  cancelButton: {
    margin: "0.5rem",
  },

  uploadButton: {
    margin: "1rem",
  },

  picture: {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    objectFit: "cover",
    boxShadow: "0 0 5px 0 grey",
  },

  pictureContainer: {
    textAlign: "center",
    marginTop: "1rem",
  },

  formGroup: {
    marginTop: "1rem",
    marginBottom: "1rem",
  },
};

const CandidateForm = ({
  initialValues,
  onSubmit,
  election,
  disabled,
  submitLabel = "Save",
  showCancelButton = false,
  cancelLabel = "Cancel",
  onCancel = () => {},
}) => {
  const [userQuery, setUserQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const { data, loading: loadingUsers } = useQuery(QUERY_USERS, {
    variables: { query: userQuery },
  });

  const {
    touched,
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    submitForm,
    setFieldValue,
    setFieldError,
    resetForm,
  } = useFormik({
    initialValues: initialValues || {
      picture: null,
      name: "",
      url: "",
      blurb: "",
      platform: "",
      managers: [],
    },
    validate: (values) => {
      const errors = {};
      if (!values.url) {
        errors.url = "Required";
      }

      if (!values.name) {
        errors.name = "Required";
      }
      return errors;
    },
    onSubmit,
    validateOnChange: false,
  });

  async function upload() {
    const picture = await promptPicture();

    if (picture) {
      const { file, alt } = picture;

      setUploading(true);

      try {
        const { data } = await uploadPicture(file, alt);

        await setFieldValue("picture", {
          id: data.id,
          alt,
          resource: {
            url: data.url,
          },
        });
      } catch (e) {
        alertDialog({ title: "Error Uploading Picture", body: e.message });
      }

      setUploading(false);
    }
  }

  function handleNameChange(ev) {
    const newVal = ev.target.value;

    if (values.url === getCandidateUrl(values.name)) {
      setFieldValue("url", getCandidateUrl(newVal));
    }

    setFieldValue("name", newVal);
  }

  return (
    <div>
      <PictureUploadDialog />

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.pictureContainer}>
          <img
            src={
              values.picture
                ? values.picture.resource.url
                : getDefaultCandidatePic(values.url)
            }
            alt={
              values.picture
                ? values.picture.alt
                : "Initials of candidate on a colored background"
            }
            style={styles.picture}
          />

          <br />

          {!!values.picture ? (
            <Button
              variant={"outlined"}
              startIcon={<Clear />}
              onClick={() => setFieldValue("picture", null)}
              sx={styles.uploadButton}
              disabled={disabled || isSubmitting}
            >
              Clear Upload
            </Button>
          ) : (
            <Button
              variant={"outlined"}
              startIcon={<AddAPhoto />}
              onClick={upload}
              sx={styles.uploadButton}
              disabled={disabled || isSubmitting || uploading}
            >
              Upload Image
            </Button>
          )}
        </div>

        <FormGroup row>
          <FormControl component="fieldset" sx={styles.nameControl}>
            <FormLabel component="legend">Candidate Names</FormLabel>
            <TextField
              name={"name"}
              value={values.name}
              onChange={handleNameChange}
              error={touched.name && !!errors.name}
              helperText={touched.name && errors.name}
              placeholder={"John Appleseed & Alex Morgan"}
              variant={"outlined"}
              disabled={disabled || isSubmitting}
              onBlur={handleBlur}
              fullWidth
            />
          </FormControl>
          <FormControl component="fieldset" sx={styles.urlControl}>
            <FormLabel component="legend">Candidate Url</FormLabel>
            <TextField
              name={"url"}
              value={values.url}
              onChange={(ev) =>
                setFieldValue("url", getCandidateUrl(ev.target.value))
              }
              error={touched.name && !!errors.url}
              helperText={
                (touched.url && errors.url) ||
                "https://vote.stuysu.org/election/" +
                  election.url +
                  "/" +
                  values.url
              }
              placeholder={"john-alex"}
              variant={"outlined"}
              disabled={disabled || isSubmitting}
              onBlur={handleBlur}
              fullWidth
            />
          </FormControl>
        </FormGroup>

        <FormGroup sx={styles.formGroup}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Blurb</FormLabel>
            <TextField
              multiline
              name={"blurb"}
              value={values.blurb}
              onChange={(ev) =>
                setFieldValue("blurb", ev.target.value.substr(0, 200))
              }
              error={touched.blurb && !!errors.blurb}
              helperText={`Summarize the campaign in a tweet, less than 200 characters. (${values.blurb.length}/200)`}
              variant={"outlined"}
              disabled={disabled || isSubmitting}
              onBlur={handleBlur}
              fullWidth
            />
          </FormControl>
        </FormGroup>

        <FormGroup sx={styles.formGroup}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Platform</FormLabel>
            <TinyEditor
              value={values.platform}
              setValue={(val) => setFieldValue("platform", val)}
              disabled={disabled || isSubmitting}
            />
          </FormControl>
          <FormHelperText>
            A longer explanation of the candidate&apos;s policies and any
            relevant information
          </FormHelperText>
        </FormGroup>

        <FormGroup row sx={styles.formGroup}>
          <FormControl fullWidth>
            <FormLabel>Add Users To Manage This Candidate</FormLabel>
            <Autocomplete
              multiple
              options={data?.allUsers?.results || []}
              getOptionLabel={(option) => `${option.name} (${option.email})`}
              value={values.managers}
              disabled={disabled || isSubmitting}
              filterSelectedOptions={false}
              freeSolo
              loading={loadingUsers}
              isOptionEqualToValue={(opts, value) => opts.id === value.id}
              onChange={(ev, opts) => setFieldValue("managers", opts)}
              renderOption={(props, option) => (
                <div {...props} key={option.id}>
                  <p>
                    <b>{option.name}</b>
                    <br />
                    {option.email} | Class of {option.gradYear} | Grade{" "}
                    {option.grade}
                  </p>
                </div>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  disabled={disabled || isSubmitting}
                  variant="outlined"
                  label={"Select Users"}
                  value={userQuery}
                  onChange={(ev) => setUserQuery(ev.target.value)}
                  helperText={
                    "These should be the candidates themselves and possibly campaign managers"
                  }
                />
              )}
            />
          </FormControl>
        </FormGroup>
        <hr />

        <Button
          onClick={submitForm}
          variant={"contained"}
          color={"primary"}
          sx={styles.submitButton}
          disabled={disabled || isSubmitting}
        >
          {submitLabel}
        </Button>
        {showCancelButton && (
          <Button
            variant={"outlined"}
            onClick={(ev) =>
              onCancel({
                ev,
                touched,
                values,
                errors,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                submitForm,
                setFieldValue,
                setFieldError,
                resetForm,
              })
            }
            disabled={disabled || isSubmitting}
            sx={styles.cancelButton}
          >
            {cancelLabel}
          </Button>
        )}
      </form>
    </div>
  );
};

export default CandidateForm;
