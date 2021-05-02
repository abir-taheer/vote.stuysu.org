export default (candidate, _, { user, signedIn }) =>
  signedIn ? candidate.managerIds.includes(user.id) : null;
