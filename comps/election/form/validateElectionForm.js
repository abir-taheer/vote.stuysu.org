export default async function validateElectionForm(values) {
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
