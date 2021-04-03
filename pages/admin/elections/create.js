import React from "react";
import AdminRequired from "../../../comps/auth/AdminRequired";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import Typography from "@material-ui/core/Typography";

import layout from "./../../../styles/layout.module.css";
import styles from "./../../../styles/Elections.module.css";
import { useFormik } from "formik";

import TextField from "@material-ui/core/TextField";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import ElectionPictureSelection from "../../../comps/admin/election/create/ElectionPictureSelection";

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

const CreateElection = () => {
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
  } = useFormik({
    initialValues: {
      name: "",
      url: "",
      type: "runoff",
      start: "",
      end: "",
    },
    validateOnChange: false,
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 400);
    },
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

  return (
    <AdminRequired>
      <div className={layout.container}>
        <main className={layout.main}>
          <Typography variant={"h1"} align={"center"}>
            Create Election | Admin Panel
          </Typography>

          <AdminTabBar />

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
                  disabled={isSubmitting}
                  onBlur={handleBlur}
                />
              </FormControl>
              <FormControl component="fieldset" className={styles.formControl}>
                <FormLabel component="legend">URL</FormLabel>
                <TextField
                  name={"url"}
                  value={values.url}
                  onChange={(ev) =>
                    setFieldValue("url", getSafeUrl(ev.target.value))
                  }
                  error={touched.name && !!errors.url}
                  helperText={
                    (touched.url && errors.url) ||
                    "https://vote.stuysu.org/election/" +
                      (values.url || "<url>")
                  }
                  placeholder={"junior-caucus-20-21"}
                  variant={"outlined"}
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                <FormControlLabel
                  value="runoff"
                  control={<Radio />}
                  label="Instant Runoff Election"
                  disabled={isSubmitting}
                />
                <FormControlLabel
                  value="plurality"
                  control={<Radio />}
                  label="Plurality (Single-Choice)"
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  onBlur={handleBlur}
                  type={"datetime-local"}
                />
              </FormControl>
            </FormGroup>
            <ElectionPictureSelection
              value={values.pictureId}
              setValue={(val) => setFieldValue("pictureId", val)}
            />

            <Button
              onClick={submitForm}
              variant={"contained"}
              color={"secondary"}
            >
              Submit
            </Button>
          </form>
        </main>
      </div>
    </AdminRequired>
  );
};

export default CreateElection;
