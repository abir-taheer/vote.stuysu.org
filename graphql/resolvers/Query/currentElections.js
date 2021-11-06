import Election from "../../../models/election";

const thirtyDays = 1000 * 60 * 60 * 24 * 30;

export default () =>
  Election.find({
    $or: [
      {
        completed: false,
      },
      {
        end: {
          $gt: new Date(Date.now() - thirtyDays),
        },
      },
    ],
  });
