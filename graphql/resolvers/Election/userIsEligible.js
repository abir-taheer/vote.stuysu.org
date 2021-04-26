export default ({ allowedGradYears }, _, { user, signedIn }) =>
  signedIn ? !!allowedGradYears?.includes(user.gradYear) : null;
