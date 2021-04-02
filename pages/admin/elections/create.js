import React from "react";
import AdminRequired from "../../../comps/auth/AdminRequired";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import Typography from "@material-ui/core/Typography";

import layout from "./../../../styles/layout.module.css";
import { useFormik } from "formik";

import TextField from "@material-ui/core/TextField";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";

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
  } = useFormik({
    initialValues: {
      name: "",
      url: "",
      type: "runoff",
      start: "",
      end: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <AdminRequired>
      <div className={layout.container}>
        <main className={layout.main}>
          <Typography variant={"h1"} align={"center"}>
            Create Election | Admin Panel
          </Typography>

          <AdminTabBar />

          <form onSubmit={handleSubmit}>
            <FormGroup
            >
              <FormControl component="fieldset">
                <FormLabel component="legend">Election Name</FormLabel>
                <TextField
                  name={"name"}
                  value={values.name}
                  onChange={handleChange}
                  error={errors.name}
                  helperText={touched.name && errors.name}
                  placeholder={"Sophomore Caucus 20-21"}
                  variant={"outlined"}
                  disabled={isSubmitting}
                  onBlur={handleBlur}
                  fullWidth
                />
              </FormControl>
              <FormControl component="fieldset">
                <FormLabel component="legend">URL</FormLabel>
                <TextField
                  name={"url"}
                  value={values.url}
                  onChange={handleChange}
                  error={errors.url}
                  helperText={
                    (touched.url && errors.url) ||
                    "https://vote.stuysu.org/election/<url>"
                  }
                  placeholder={"soph-caucus-19-20"}
                  variant={"outlined"}
                  disabled={isSubmitting}
                  onBlur={handleBlur}
                  fullWidth
                />
              </FormControl>
              <FormControl component="fieldset">
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
              <FormControl component="fieldset">
                <FormLabel component="legend">Start Time</FormLabel>
                <TextField
                  name={"start"}
                  value={values.start}
                  onChange={handleChange}
                  error={errors.start}
                  helperText={touched.start && errors.start}
                  variant={"outlined"}
                  disabled={isSubmitting}
                  onBlur={handleBlur}
                  type={"datetime-local"}
                />
              </FormControl>

              <FormControl component="fieldset">
                <FormLabel component="legend">End Time</FormLabel>
                <TextField
                  name={"end"}
                  value={values.end}
                  onChange={handleChange}
                  error={errors.end}
                  helperText={touched.end && errors.end}
                  variant={"outlined"}
                  disabled={isSubmitting}
                  onBlur={handleBlur}
                  type={"datetime-local"}
                />
              </FormControl>
            </FormGroup>

            <Button onClick={submitForm}>Submit</Button>
          </form>
        </main>
      </div>
    </AdminRequired>
  );
};

export default CreateElection;
