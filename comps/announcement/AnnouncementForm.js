import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React, { useState } from "react";
import { useFormik } from "formik";
import styles from "./AnnouncementForm.module.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { gql, useQuery } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import TinyEditor from "../shared/TinyEditor";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { KeyboardDateTimePicker } from "@material-ui/pickers";

async function validate(values) {
  const errors = {};

  if (!values.title) {
    errors.title = "Required";
  }

  if (!values.body) {
    errors.body = "Required";
  }

  if (!values.permanent) {
    if (!values.start) {
      errors.start = "Start time required if announcement not always displayed";
    }

    if (!values.end) {
      errors.end = "End time required if announcement not always displayed";
    }
  }

  if (values.start && values.end) {
    const start = new Date(values.start);
    const end = new Date(values.end);

    if (end < start) {
      errors.end = "The start must be before the end";
    }
  }
  if (!values.election && !values.showOnHome) {
    errors.election =
      "Election required if announcement is not shown on home page";
  }

  return errors;
}

const QUERY = gql`
  query($query: String!) {
    allElections(query: $query) {
      results {
        id
        name
        url
      }
    }
  }
`;

const AnnouncementForm = ({
  initialValues,
  onSubmit,
  submitLabel = "Submit",
  showCancelButton = false,
  cancelLabel = "Cancel",
  onCancel,
  disabled,
}) => {
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
      title: "",
      body: "",
      permanent: false,
      start: null,
      end: null,
      showOnHome: false,
      election: null,
    },
    validateOnChange: false,
    onSubmit: onSubmit,
    validate,
  });

  const [query, setQuery] = useState("");
  const { data, loading } = useQuery(QUERY, { variables: { query } });
  const elections = data?.allElections?.results || [];

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <FormGroup row>
        <FormControl
          component="fieldset"
          className={styles.formControl}
          fullWidth
        >
          <FormLabel component="legend">Title</FormLabel>
          <TextField
            name={"title"}
            value={values.title}
            onChange={handleChange}
            error={touched.title && !!errors.title}
            helperText={touched.title && errors.title}
            placeholder={"Freshman Caucus Debate Now Available"}
            variant={"outlined"}
            disabled={disabled || isSubmitting}
            onBlur={handleBlur}
          />
        </FormControl>
      </FormGroup>
      <FormControl
        component="fieldset"
        className={styles.formControl}
        fullWidth
      >
        <FormLabel component="legend">Content</FormLabel>
        <TinyEditor
          value={values.body}
          setValue={(v) => setFieldValue("body", v)}
          disabled={disabled || isSubmitting}
        />
        <FormHelperText>{errors.body}</FormHelperText>
      </FormControl>

      <FormControl
        component="fieldset"
        className={styles.formControl}
        fullWidth
      >
        <FormLabel component="legend">Assign To Election (optional)</FormLabel>
        <Autocomplete
          getOptionSelected={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
          onChange={(ev, val) => setFieldValue("election", val)}
          options={elections}
          loading={loading}
          filterSelectedOptions={false}
          disabled={disabled || isSubmitting}
          value={values.election}
          renderInput={(params) => (
            <TextField
              {...params}
              disabled={disabled || isSubmitting}
              variant="outlined"
              onChange={(ev) => setQuery(ev.target.value)}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        <FormHelperText>
          If this announcement is specific to an election, you can select it
          here and it will show up on that election's page
        </FormHelperText>
      </FormControl>

      <FormGroup row>
        <FormControl component="fieldset" className={styles.formControl}>
          <FormLabel component="legend">Start Time</FormLabel>
          <KeyboardDateTimePicker
            variant="inline"
            inputVariant={"outlined"}
            value={values.start}
            onChange={(val) => setFieldValue("start", val)}
            onError={console.log}
            format="MM/DD/yyyy hh:mma"
            ampm
            error={touched.start && !!errors.start}
            helperText={touched.start && errors.start}
            disabled={disabled || isSubmitting || values.permanent}
            placeholder="05/05/2021 06:00am"
          />
        </FormControl>

        <FormControl component="fieldset" className={styles.formControl}>
          <FormLabel component="legend">End Time</FormLabel>
          <KeyboardDateTimePicker
            variant="inline"
            inputVariant={"outlined"}
            value={values.end}
            onChange={(val) => setFieldValue("end", val)}
            onError={console.log}
            format="MM/DD/yyyy hh:mma"
            placeholder="05/05/2021 07:00pm"
            disabled={disabled || isSubmitting || values.permanent}
            error={touched.end && !!errors.end}
            helperText={touched.end && errors.end}
            ampm
          />
        </FormControl>
      </FormGroup>

      <FormControl
        component="fieldset"
        className={styles.formControl}
        disabled={disabled || isSubmitting}
      >
        <FormLabel component="legend">Options</FormLabel>
        <FormGroup>
          <FormControlLabel
            disabled={disabled || isSubmitting}
            control={
              <Checkbox
                checked={values.permanent}
                onChange={handleChange}
                name="permanent"
              />
            }
            label="Always Show"
          />
          <FormControlLabel
            control={
              <Checkbox
                disabled={disabled || isSubmitting}
                checked={values.showOnHome}
                onChange={handleChange}
                name="showOnHome"
              />
            }
            label={"Show On Home Page"}
          />
        </FormGroup>
      </FormControl>

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
  );
};

export default AnnouncementForm;
