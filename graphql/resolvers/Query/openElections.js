import Election from "../../../models/election";

export default () => Election.find({ completed: false });
