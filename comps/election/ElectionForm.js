import School from "@mui/icons-material/School";
import DateTimePicker from "@mui/lab/DateTimePicker";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import React from "react";
import styles from "./ElectionForm.module.css";
import ElectionPictureSelection from "./ElectionPictureSelection";

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
      errors.end = "The start must be before the end";
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
    <form onSubmit={handleSubmit}>
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
          <DateTimePicker
            variant="inline"
            inputVariant={"outlined"}
            value={values.start}
            onChange={(val) => setFieldValue("start", val)}
            onError={console.log}
            format="MM/DD/yyyy hh:mma"
            ampm
            error={touched.start && !!errors.start}
            helperText={touched.start && errors.start}
            disabled={disabled || isSubmitting}
            placeholder="05/05/2021 06:00am"
          />
        </FormControl>

        <FormControl component="fieldset" className={styles.formControl}>
          <FormLabel component="legend">End Time</FormLabel>
          <DateTimePicker
            variant="inline"
            inputVariant={"outlined"}
            value={values.end}
            onChange={(val) => setFieldValue("end", val)}
            onError={console.log}
            format="MM/DD/yyyy hh:mma"
            placeholder="05/05/2021 07:00pm"
            disabled={disabled || isSubmitting}
            error={touched.end && !!errors.end}
            helperText={touched.end && errors.end}
            ampm
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
          className={styles.gradYearInput}
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
