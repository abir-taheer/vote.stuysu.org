import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import TinyEditor from "../shared/TinyEditor";

function validate(values) {
  const errors = {};

  if (!values.title) {
    errors.title = "Required";
  }

  if (!values.url) {
    errors.url = "Required";
  }

  return errors;
}

function getSafeUrl(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9- ]/gi, "")
    .replace(/\s+/g, "-");
}

const styles = {
  textField: {
    "@media (min-width: 800px)": {
      width: "46%",
      margin: "2%",
    },
    "@media (max-width: 799px)": {
      margin: "2%",
      width: "96%",
    },
  },
  editor: {
    margin: "2%",
  },
  divider: {
    margin: "1.5rem 2%",
  },

  button: {
    margin: "0 2%",
  },
};

export default function FAQForm({
  initialValues,
  onSubmit,
  submitLabel = "Submit",
  showCancelButton = false,
  showSubmitButton = true,
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
      url: "",
    },
    validateOnChange: false,
    onSubmit: onSubmit,
    validate,
  });

  const handleNameChange = (ev) => {
    const currentExpectedUrl = getSafeUrl(values.title);
    const title = ev.target.value;
    if (values.url === currentExpectedUrl) {
      setFieldValue("url", getSafeUrl(title));
    }

    setFieldValue("title", title);
  };

  return (
    <form>
      <TextField
        name={"title"}
        value={values.title}
        onChange={handleNameChange}
        label={"Title"}
        error={!!errors.title}
        helperText={touched.title && errors.title}
        sx={styles.textField}
        disabled={disabled || isSubmitting}
        fullWidth
      />
      <TextField
        fullWidth
        sx={styles.textField}
        disabled={disabled || isSubmitting}
        name={"url"}
        value={values.url}
        onChange={(ev) => setFieldValue("url", getSafeUrl(ev.target.value))}
        label={"URL"}
        error={!!errors.url}
        helperText={
          touched.title && errors.title
            ? errors.title
            : "vote.stuysu.org/faq/" + values.url
        }
      />

      <TinyEditor
        value={values.body}
        setValue={(val) => setFieldValue("body", val)}
        style={styles.editor}
        disabled={disabled || isSubmitting}
      />

      <Divider sx={styles.divider} />
      {showSubmitButton && (
        <Button
          sx={styles.button}
          variant={"contained"}
          onClick={handleSubmit}
          disabled={disabled || isSubmitting}
        >
          {submitLabel}
        </Button>
      )}
      {showCancelButton && (
        <Button
          sx={styles.button}
          variant={"outlined"}
          disabled={disabled || isSubmitting}
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
        >
          {cancelLabel}
        </Button>
      )}
    </form>
  );
}
