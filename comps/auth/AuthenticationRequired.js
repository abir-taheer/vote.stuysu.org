import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import carryingKey from "./../../img/carrying-key.svg";
import layout from "./../../styles/layout.module.css";
import useLogin from "./useLogin";
import UserContext from "./UserContext";

const AuthenticationRequired = ({ children }) => {
  const user = useContext(UserContext);
  const { signIn } = useLogin();

  if (!user.signedIn) {
    return (
      <div className={layout.container}>
        <main className={layout.main}>
          <img
            className={layout.largeVector}
            src={carryingKey}
            alt={"Two people carrying a key"}
          />
          <Typography variant={"h1"} className={layout.title}>
            You need to sign in to view this page
          </Typography>
          <Button color={"secondary"} variant={"contained"} onClick={signIn}>
            Sign In
          </Button>
        </main>
      </div>
    );
  }

  return children;
};

export default AuthenticationRequired;
