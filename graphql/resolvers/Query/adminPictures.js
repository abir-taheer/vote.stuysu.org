import Picture from "../../../models/picture";

export default (_, __, { adminRequired }) => {
  adminRequired();
  // Find all the pictures where the public_id starts with "admin/"
  return Picture.find({ resourceId: /^admin\// });
};
