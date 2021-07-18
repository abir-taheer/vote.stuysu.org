import { useFormik } from "formik";
import styles from "./UserForm.module.css";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import React from "react";
import confirmDialog from "../dialog/confirmDialog";
import calcGrade from "../../utils/user/calcGrade";
import gradYear from "../../graphql/resolvers/User/gradYear";
import Typography from "@material-ui/core/Typography";

function gradYearIsValid(gradYear) {
  return (
    gradYear &&
    gradYear > 1000 &&
    gradYear < 20000 &&
    String(gradYear).match(/^\d+$/)
  );
}

async function validate(values) {
  const errors = {};

  if (!values.firstName) {
    errors.firstName = "Required";
  }

  if (!values.lastName) {
    errors.lastName = "Required";
  }

  if (!values.email) {
    errors.email = "Required";
  } else if (!values.email.endsWith("@stuy.edu")) {
    errors.email = "Only stuy.edu emails are valid";
  }

  if (
    typeof values.gradYear === "number" &&
    !gradYearIsValid(values.gradYear)
  ) {
    errors.gradYear =
      "Graduation year is not valid. Enter a year greater than 1000 or leave the field empty";
  }

  return errors;
}

const UserForm = ({
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
      firstName: "",
      lastName: "",
      email: "",
      gradYear: null,
      adminPrivileges: false,
    },
    validateOnChange: false,
    onSubmit: onSubmit,
    validate,
  });

  const toggleAdmin = async () => {
    if (values.adminPrivileges) {
      await setFieldValue("adminPrivileges", false);
    } else {
      const confirmation = await confirmDialog({
        title: "Are you sure?",
        body: "Giving this person admin privileges will allow them to access this administration portal and possibly make dangerous changes",
      });

      if (confirmation) {
        await setFieldValue("adminPrivileges", true);
      }
    }
  };

  const grade = gradYearIsValid(values.gradYear)
    ? calcGrade(values.gradYear)
    : null;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <FormGroup row>
        <FormControl component="fieldset" className={styles.formControl}>
          <FormLabel component="legend">First Name</FormLabel>
          <TextField
            name={"firstName"}
            value={values.firstName}
            onChange={handleChange}
            error={touched.firstName && !!errors.firstName}
            helperText={touched.firstName && errors.firstName}
            placeholder={"Johnny"}
            variant={"outlined"}
            disabled={disabled || isSubmitting}
            onBlur={handleBlur}
          />
        </FormControl>
        <FormControl component="fieldset" className={styles.formControl}>
          <FormLabel component="legend">Last Name</FormLabel>
          <TextField
            name={"lastName"}
            value={values.lastName}
            onChange={handleChange}
            error={touched.lastName && !!errors.lastName}
            helperText={touched.lastName && errors.lastName}
            placeholder={"Appleseed"}
            variant={"outlined"}
            disabled={disabled || isSubmitting}
            onBlur={handleBlur}
            fullWidth
          />
        </FormControl>
      </FormGroup>

      <FormGroup row>
        <FormControl component="fieldset" className={styles.emailControl}>
          <FormLabel component="legend">Email Address</FormLabel>
          <TextField
            name={"email"}
            type={"email"}
            value={values.email}
            onChange={handleChange}
            error={touched.email && !!errors.email}
            helperText={touched.email && errors.email}
            placeholder={"john@stuy.edu"}
            variant={"outlined"}
            disabled={disabled || isSubmitting}
            onBlur={handleBlur}
            fullWidth
          />
        </FormControl>
        <FormControl component="fieldset" className={styles.gradYearControl}>
          <FormLabel component="legend">
            Graduation Year{" "}
            {!!grade && (
              <Typography
                variant={"inherit"}
                component={"span"}
                color={"secondary"}
              >
                <b>({grade < 13 ? "Grade " + grade : "Alumni"})</b>
              </Typography>
            )}
          </FormLabel>
          <TextField
            name={"gradYear"}
            value={values.gradYear}
            onChange={handleChange}
            error={touched.gradYear && !!errors.gradYear}
            helperText={
              touched.gradYear && !!errors.gradYear
                ? errors.gradYear
                : "You can leave this empty if this is faculty like Mr. Polazzo"
            }
            type={"number"}
            min={1000}
            step={1}
            placeholder={"2021"}
            variant={"outlined"}
            disabled={disabled || isSubmitting}
            onBlur={handleBlur}
            fullWidth
          />
        </FormControl>
      </FormGroup>

      <FormGroup row>
        <FormControl
          component="fieldset"
          className={styles.formControl}
          disabled={disabled || isSubmitting}
        >
          <FormLabel component="legend">Options</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={disabled || isSubmitting}
                  checked={values.adminPrivileges}
                  onChange={toggleAdmin}
                  name="adminPrivileges"
                />
              }
              label={"Admin Privileges"}
            />
          </FormGroup>
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
  );
};

export default UserForm;
