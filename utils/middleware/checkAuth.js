import User from "../../models/user";
import getJWTData from "../auth/getJWTData";

export default async function checkAuth(req, res, next) {
  req.user = null;
  req.signedIn = false;

  let jwt =
    req.cookies["auth-jwt"] ||
    req.headers["x-access-token"] ||
    req.headers["authorization"] ||
    req.query.jwt;

  if (jwt && jwt.startsWith("Bearer ")) {
    jwt = jwt.replace("Bearer ", "");
  }

  if (jwt) {
    const data = await getJWTData(jwt);
    let user;

    if (data) {
      user = await User.findById(data.user.id);
    }

    if (user) {
      req.user = user;
      req.signedIn = true;
    }
  }

  next();
}
