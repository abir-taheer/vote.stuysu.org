export default async function validateAnnouncementForm(values) {
  const errors = {};

  if (!values.title) {
    errors.title = "Required";
  }

  if (!values.body) {
    errors.body = "Required";
  }

  if (!values.permanent) {
    if (!values.start) {
      errors.start = "Start time required if announcement not always displayed";
    }

    if (!values.end) {
      errors.end = "End time required if announcement not always displayed";
    }
  }

  if (values.start && values.end) {
    const start = new Date(values.start);
    const end = new Date(values.end);

    if (end < start) {
      errors.end = "The start must be before the end";
    }
  }
  if (!values.election && !values.showOnHome) {
    errors.election =
      "Election required if announcement is not shown on home page";
  }

  return errors;
}
