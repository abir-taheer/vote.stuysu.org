import School from "@mui/icons-material/School";
import DateTimePicker from "@mui/lab/DateTimePicker";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import React from "react";
import ElectionPictureSelection from "./ElectionPictureSelection";
import getSafeUrl from "./getSafeElectionUrl";
import validate from "./validateElectionForm";

const styles = {
  gradYearInput: {
    "@media (max-width: 700px)": {
      maxWidth: "calc(100% - 80px)",
    },
  },

  gradYearContainer: {
    "@media (min-width: 470px)": {
      marginLeft: "0.5rem",
    },
  },

  input: {
    marginTop: "10px",
    marginBottom: "10px",
  },

  formControl: {
    marginBottom: "15px",

    "@media (min-width: 470px)": {
      margin: "1.25%",
      width: "45%",
    },
  },

  gradYearButton: {
    margin: "0.5rem",
    height: "54px",
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
};

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
        <FormControl component="fieldset" sx={styles.formControl}>
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
        <FormControl component="fieldset" sx={styles.formControl}>
          <FormLabel component="legend">URL</FormLabel>
          <TextField
            name={"url"}
            value={values.url}
            onChange={(ev) => setFieldValue("url", getSafeUrl(ev.target.value))}
            error={touched.name && !!errors.url}
            helperText={
              (touched.url && errors.url) ||
              "vote.stuysu.org/election/" + (values.url || "<url>")
            }
            placeholder={"junior-caucus-20-21"}
            variant={"outlined"}
            disabled={disabled || isSubmitting}
            onBlur={handleBlur}
            fullWidth
          />
        </FormControl>
      </FormGroup>
      <FormControl component="fieldset" sx={styles.formControl}>
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
      <Container sx={styles.gradYearContainer} disableGutters>
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
          sx={styles.gradYearInput}
        />
        <Button
          variant={"contained"}
          sx={styles.gradYearButton}
          onClick={addAllowedGradYear}
          color={"secondary"}
          disabled={isSubmitting || disabled}
        >
          Add
        </Button>
        <div>
          {values.allowedGradYears.map((year) => (
            <Chip
              sx={styles.chip}
              label={"Class of " + year}
              onDelete={() => removeGradYear(year)}
              color="secondary"
              key={year}
              icon={<School />}
              disabled={isSubmitting || disabled}
            />
          ))}
        </div>
      </Container>
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
};

export default ElectionForm;
