import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import React from "react";
import calcGrade from "../../../utils/user/calcGrade";
import confirmDialog from "../../dialog/confirmDialog";
import gradYearIsValid from "./gradYearIsValid";
import validate from "./validateUserForm";

const styles = {
  formControl: {
    margin: "0.5rem",
    "@media (min-width: 800px)": {
      width: "calc(50% - 1rem)",
    },
  },
  emailControl: {
    margin: "0.5rem",
    "@media (min-width: 800px)": {
      marginRight: "1rem",
      width: "calc(100% - (2.5rem + 250px))",
    },
    "@media (max-width: 799px)": {
      width: "100%",
    },
  },
  gradYearControl: {
    margin: "0.5rem",

    "@media (min-width: 800px)": {
      width: "250px",
    },

    "@media (max-width: 799px)": {
      width: "100%",
    },
  },
  button: {
    margin: "0.5rem",
  },
  formGroup: {
    marginTop: "1rem",
    marginBottom: "1rem",
  },
};

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
    <Container maxWidth={"md"}>
      <form onSubmit={handleSubmit}>
        <FormGroup row>
          <FormControl component="fieldset" sx={styles.formControl}>
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
          <FormControl component="fieldset" sx={styles.formControl}>
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
          <FormControl component="fieldset" sx={styles.emailControl}>
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
          <FormControl component="fieldset" sx={styles.gradYearControl}>
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
            sx={styles.formControl}
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
          sx={styles.button}
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
            sx={styles.button}
          >
            {cancelLabel}
          </Button>
        )}
      </form>
    </Container>
  );
};

export default UserForm;
