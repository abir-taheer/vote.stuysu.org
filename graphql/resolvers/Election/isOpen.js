export default ({ completed, start, end }) => {
  const now = new Date();
  return !completed && now > start && now < end;
};
