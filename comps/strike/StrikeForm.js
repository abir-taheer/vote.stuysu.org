import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import React from "react";

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

  submitButton: {
    margin: "0.5rem",
  },

  cancelButton: {
    margin: "0.5rem",
  },
};

function validate(values) {
  const errors = {};

  if (
    typeof values.weight !== "number" ||
    isNaN(values.weight) ||
    values.weight < 0
  ) {
    errors.weight = "Must be a non-negative number";
  }

  return errors;
}

const StrikeForm = ({
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
      weight: 1,
      reason: "",
    },
    validateOnChange: false,
    onSubmit: onSubmit,
    validate,
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup row>
        <FormControl component="fieldset" sx={styles.formControl}>
          <FormLabel component="legend">Weight</FormLabel>
          <TextField
            name={"weight"}
            value={values.weight}
            onChange={handleChange}
            error={touched.weight && !!errors.weight}
            helperText={touched.weight && errors.weight}
            placeholder={"1"}
            type={"number"}
            variant={"outlined"}
            disabled={disabled || isSubmitting}
            onBlur={handleBlur}
          />
        </FormControl>
      </FormGroup>

      <FormGroup row>
        <FormControl component="fieldset" sx={styles.formControl} fullWidth>
          <FormLabel component="legend">Reason</FormLabel>
          <TextField
            value={values.reason}
            name={"reason"}
            onChange={handleChange}
            variant={"outlined"}
            placeholder={
              "i.e. The candidate distributed flyers in a location that they didn't reserve for that day."
            }
            multiline
            rows={4}
            fullWidth
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
  );
};

export default StrikeForm;
