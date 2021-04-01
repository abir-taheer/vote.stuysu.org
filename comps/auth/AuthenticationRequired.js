import { useContext } from "react";
import UserContext from "./UserContext";
import carryingKey from "./../../img/carrying-key.svg";
import layout from "./../../styles/layout.module.css";
import Button from "@material-ui/core/Button";
import useLogin from "./useLogin";

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
          <h1 className={layout.title}>
            You need to sign in to view this page
          </h1>
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
