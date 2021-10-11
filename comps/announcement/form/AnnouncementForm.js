import { gql, useQuery } from "@apollo/client";
import Autocomplete from "@mui/lab/Autocomplete";
import DateTimePicker from "@mui/lab/DateTimePicker";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import React, { useState } from "react";
import TinyEditor from "../../shared/TinyEditor";
import validate from "./validateAnnouncementForm";

const QUERY = gql`
  query ($query: String!) {
    allElections(query: $query) {
      results {
        id
        name
        url
      }
    }
  }
`;

const styles = {
  form: {
    maxWidth: "1200px",
  },

  formControl: {
    margin: "0.5rem",
  },

  submitButton: {
    margin: "0.5rem",
  },

  cancelButton: {
    margin: "0.5rem",
  },
};

function AnnouncementForm({
  initialValues,
  onSubmit,
  submitLabel = "Submit",
  showCancelButton = false,
  cancelLabel = "Cancel",
  onCancel,
  disabled,
}) {
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
    <form onSubmit={handleSubmit} style={styles.form}>
      <FormGroup row>
        <FormControl component="fieldset" sx={styles.formControl} fullWidth>
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
      <FormControl component="fieldset" sx={styles.formControl} fullWidth>
        <FormLabel component="legend">Content</FormLabel>
        <TinyEditor
          value={values.body}
          setValue={(v) => setFieldValue("body", v)}
          disabled={disabled || isSubmitting}
        />
        <FormHelperText>{errors.body}</FormHelperText>
      </FormControl>

      <FormControl component="fieldset" sx={styles.formControl} fullWidth>
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
        <FormHelperText error={touched.election && errors.election}>
          {touched.election && errors.election
            ? errors.election
            : "If this announcement is specific to an election, you can select it here and it will show up on that election's page"}
        </FormHelperText>
      </FormControl>

      <FormGroup row>
        <FormControl component="fieldset" sx={styles.formControl}>
          <FormLabel component="legend">Start Time</FormLabel>
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            value={values.start}
            label={"10/22/2021 05:00AM"}
            onChange={(val) => setFieldValue("start", val)}
            disabled={disabled || isSubmitting}
          />
        </FormControl>

        <FormControl component="fieldset" sx={styles.formControl}>
          <FormLabel component="legend">End Time</FormLabel>
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            value={values.end}
            label={"10/22/2021 06:00PM"}
            onChange={(val) => setFieldValue("end", val)}
            disabled={disabled || isSubmitting}
          />
        </FormControl>
      </FormGroup>

      <FormControl
        component="fieldset"
        sx={styles.formControl}
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
  );
}

export default AnnouncementForm;
