import styles from "./ElectionForm.module.css";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import ElectionPictureSelection from "./ElectionPictureSelection";
import Button from "@material-ui/core/Button";
import React from "react";
import { useFormik } from "formik";
import Chip from "@material-ui/core/Chip";
import School from "@material-ui/icons/School";

async function validate(values) {
  const errors = {};

  if (!values.name) {
    errors.name = "Required";
  } else if (name.length > 48) {
    errors.name = "Max length 48 characters";
  }

  if (!values.url) {
    errors.url = "Required";
  } else if (values.url.length > 48) {
    errors.url = "Max length 48 characters";
  }

  if (!values.start) {
    errors.start = "Required";
  }

  if (!values.end) {
    errors.end = "Required";
  } else if (values.start) {
    const start = new Date(values.start);
    const end = new Date(values.end);

    if (end < start) {
      errors.end = "The end must be before the start";
    }
  }

  if (!values.pictureId) {
    errors.pictureId = "Required";
  }

  return errors;
}

function getSafeUrl(str) {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

const ElectionForm = ({
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
      name: "",
      url: "",
      type: "runoff",
      pictureId: null,
      start: "",
      end: "",
      gradYear: "",
      allowedGradYears: [],
    },
    validateOnChange: false,
    onSubmit: onSubmit,
    validate,
  });

  function handleNameChange(ev) {
    const name = ev.target.value;
    const safeUrl = getSafeUrl(name);

    if (values.url === getSafeUrl(values.name)) {
      setFieldValue("url", safeUrl);
    }

    setFieldValue("name", name);
  }

  function addAllowedGradYear() {
    let error;
    const gradYear = Number(values.gradYear);
    if (!gradYear || gradYear < 0) {
      error = "Not a valid graduation year";
    } else if (values.allowedGradYears.includes(gradYear)) {
      error = "Already added";
    }

    if (error) {
      setFieldError("gradYear", error);
    } else {
      const newYears = values.allowedGradYears.concat(gradYear);
      newYears.sort();
      setFieldValue("allowedGradYears", newYears);
      setFieldValue("gradYear", "");
    }
  }

  function removeGradYear(year) {
    const newYears = [...values.allowedGradYears];
    const deleteIndex = newYears.indexOf(year);

    if (deleteIndex !== -1) {
      newYears.splice(deleteIndex, 1);
      setFieldValue("allowedGradYears", newYears);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <FormGroup row>
        <FormControl component="fieldset" className={styles.formControl}>
          <FormLabel component="legend">Election Name</FormLabel>
          <TextField
            name={"name"}
            value={values.name}
            onChange={handleNameChange}
            error={touched.name && !!errors.name}
            helperText={touched.name && errors.name}
            placeholder={"Junior Caucus 20-21"}
            variant={"outlined"}
            disabled={disabled || isSubmitting}
            onBlur={handleBlur}
          />
        </FormControl>
        <FormControl component="fieldset" className={styles.formControl}>
          <FormLabel component="legend">URL</FormLabel>
          <TextField
            name={"url"}
            value={values.url}
            onChange={(ev) => setFieldValue("url", getSafeUrl(ev.target.value))}
            error={touched.name && !!errors.url}
            helperText={
              (touched.url && errors.url) ||
              "https://vote.stuysu.org/election/" + (values.url || "<url>")
            }
            placeholder={"junior-caucus-20-21"}
            variant={"outlined"}
            disabled={disabled || isSubmitting}
            onBlur={handleBlur}
            fullWidth
          />
        </FormControl>
      </FormGroup>

      <FormControl component="fieldset" className={styles.formControl}>
        <FormLabel component="legend">Election Type</FormLabel>
        <RadioGroup
          name="type"
          value={values.type}
          onChange={handleChange}
          disabled={disabled || isSubmitting}
        >
          <FormControlLabel
            value="runoff"
            control={<Radio />}
            label="Instant Runoff Election"
            disabled={disabled || isSubmitting}
          />
          <FormControlLabel
            value="plurality"
            control={<Radio />}
            label="Plurality (Single-Choice)"
            disabled={disabled || isSubmitting}
          />
        </RadioGroup>
      </FormControl>

      <FormGroup row>
        <FormControl component="fieldset" className={styles.formControl}>
          <FormLabel component="legend">Start Time</FormLabel>
          <TextField
            name={"start"}
            value={values.start}
            onChange={handleChange}
            error={touched.start && !!errors.start}
            helperText={touched.start && errors.start}
            variant={"outlined"}
            disabled={disabled || isSubmitting}
            onBlur={handleBlur}
            type={"datetime-local"}
          />
        </FormControl>

        <FormControl component="fieldset" className={styles.formControl}>
          <FormLabel component="legend">End Time</FormLabel>
          <TextField
            name={"end"}
            value={values.end}
            onChange={handleChange}
            error={touched.end && !!errors.end}
            helperText={touched.end && errors.end}
            variant={"outlined"}
            disabled={disabled || isSubmitting}
            onBlur={handleBlur}
            type={"datetime-local"}
          />
        </FormControl>
      </FormGroup>

      <div className={styles.gradYearContainer}>
        <FormLabel component="legend">
          Which Graduating Classes Can Vote?
        </FormLabel>

        <TextField
          name={"gradYear"}
          value={values.gradYear}
          onChange={handleChange}
          error={touched.gradYear && !!errors.gradYear}
          helperText={touched.gradYear && errors.gradYear}
          variant={"outlined"}
          disabled={disabled || isSubmitting}
          onBlur={handleBlur}
          type={"number"}
          min={2000}
          placeholder={"2021"}
        />
        <Button
          variant={"contained"}
          className={styles.gradYearButton}
          onClick={addAllowedGradYear}
          color={"secondary"}
          disabled={isSubmitting || disabled}
        >
          Add
        </Button>
        <div>
          {values.allowedGradYears.map((year) => (
            <Chip
              className={styles.chip}
              label={"Class of " + year}
              onDelete={() => removeGradYear(year)}
              color="secondary"
              key={year}
              icon={<School />}
              disabled={isSubmitting || disabled}
            />
          ))}
        </div>
      </div>

      <ElectionPictureSelection
        value={values.pictureId}
        setValue={(val) => setFieldValue("pictureId", val)}
        error={errors.pictureId}
        touched={touched.pictureId}
        disabled={isSubmitting || disabled}
      />

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

export default ElectionForm;
