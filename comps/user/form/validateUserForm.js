import gradYearIsValid from "./gradYearIsValid";

export default async function validateUserForm(values) {
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
