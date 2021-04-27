export default (_, __, { setCookie }) => {
  setCookie("auth-jwt", "", {
    expires: new Date(1),
    httpOnly: true,
    path: "/",
  });
};
