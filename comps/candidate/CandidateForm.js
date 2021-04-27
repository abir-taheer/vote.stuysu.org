import React, { useState } from "react";
import { useFormik } from "formik";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { gql, useMutation, useQuery } from "@apollo/client";
import PictureUploadDialog, {
  promptPicture,
} from "../shared/PictureUploadDialog";
import styles from "./CandidateForm.module.css";
import getDefaultCandidatePic from "../../utils/candidate/getDefaltCandidatePic";
import AddAPhoto from "@material-ui/icons/AddAPhoto";
import alertDialog from "../dialog/alertDialog";
import Clear from "@material-ui/icons/Clear";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";
import PlatformEditor from "./PlatformEditor";
import { FormHelperText } from "@material-ui/core";

function getCandidateUrl(val) {
  return val
    .toLowerCase()
    .replace(/[^a-z0-9-& ]/g, "")
    .split(/ +(?:and|&) +/i)
    .map((a) => a.split(/ +/).filter(Boolean)[0])
    .join("-");
}

const UPLOAD_MUTATION = gql`
  mutation($alt: NonEmptyString!, $file: Upload!) {
    uploadPicture(alt: $alt, file: $file) {
      id
      alt
      resource {
        url
      }
    }
  }
`;

const QUERY_USERS = gql`
  query($query: String!) {
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

  const [upload, { loading: loadingUpload }] = useMutation(UPLOAD_MUTATION);

  async function uploadPicture() {
    const picture = await promptPicture();
    if (picture) {
      const { data, error } = await upload({
        variables: { alt: picture.alt, file: picture.file },
      });

      if (error) {
        await alertDialog({
          title: "Error uploading picture",
          body: error.message,
        });
      } else {
        await setFieldValue("picture", data.uploadPicture);
      }
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

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.pictureContainer}>
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
            className={styles.picture}
          />

          <br />

          {!!values.picture ? (
            <Button
              variant={"outlined"}
              startIcon={<Clear />}
              onClick={() => setFieldValue("picture", null)}
              className={styles.uploadButton}
              disabled={disabled || isSubmitting}
            >
              Clear Upload
            </Button>
          ) : (
            <Button
              variant={"outlined"}
              startIcon={<AddAPhoto />}
              onClick={uploadPicture}
              className={styles.uploadButton}
              disabled={disabled || isSubmitting || loadingUpload}
            >
              Upload Image
            </Button>
          )}
        </div>

        <FormGroup row>
          <FormControl component="fieldset" className={styles.nameControl}>
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
          <FormControl component="fieldset" className={styles.urlControl}>
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

        <FormGroup className={styles.formGroup}>
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

        <FormGroup className={styles.formGroup}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Platform</FormLabel>
            <PlatformEditor
              value={values.platform}
              setValue={(val) => setFieldValue("platform", val)}
              disabled={disabled || isSubmitting}
            />
          </FormControl>
          <FormHelperText>
            A longer explanation of the candidate's policies and any relevant
            information
          </FormHelperText>
        </FormGroup>

        <FormGroup row className={styles.formGroup}>
          <FormControl fullWidth>
            <FormLabel>Add Users To Manage This Candidate</FormLabel>
            <Autocomplete
              multiple
              disabled={disabled || isSubmitting}
              options={data?.allUsers?.results || []}
              getOptionLabel={(option) => option.name}
              getOptionSelected={(opts, value) => opts.id === value.id}
              freeSolo
              loading={loadingUsers}
              value={values.managers}
              onChange={(ev, opts) => setFieldValue("managers", opts)}
              renderOption={(option) => (
                <p>
                  <b>{option.name}</b>
                  <br />
                  {option.email} | Class of {option.gradYear} | Grade{" "}
                  {option.grade}
                </p>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={`${option.name} (${option.email})`}
                    {...getTagProps({ index })}
                  />
                ))
              }
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
          className={styles.submitButton}
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
            className={styles.cancelButton}
          >
            {cancelLabel}
          </Button>
        )}
      </form>
    </div>
  );
};

export default CandidateForm;
