import { CircularProgress } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { useState } from "react";
import alertDialog from "../dialog/alertDialog";
import layout from "./../../styles/layout.module.css";
import LoginButton from "./LoginButton";
import useGSI from "./useGSI";

const useLogin = (props = {}) => {
  const { onLogin } = props;
  const [showedOneTap, setShowedOneTap] = useState(false);
  const { ready, authenticating } = useGSI({ onLogin });

  const showLoginDialog = () => {
    alertDialog({
      title: "Logging in",
      body: (
        <div>
          <Typography variant={"body1"}>
            This app uses{" "}
            <Link
              href={"https://developers.google.com/identity/gsi/web"}
              target={"_blank"}
              color={"secondary"}
            >
              Google Sign In (GSI)
            </Link>{" "}
            to sign you in and only requests the basic profile scope.
          </Typography>
          <Typography variant={"body1"}>
            Click the "Sign In With Google" button on the below and sign in
            using your <b>@stuy.edu</b> email address.
          </Typography>
          <Typography variant={"body1"}>
            If the login popup doesn't open, refresh the page and try again or
            contact stuyboe@gmail.com
          </Typography>

          <div className={layout.flexCenter}>
            {authenticating ? <CircularProgress /> : <LoginButton />}
          </div>
        </div>
      ),
    });
  };

  const signIn = () => {
    {
      if (ready) {
        if (showedOneTap) {
          setShowedOneTap(true);

          window.google.accounts.id.prompt((notification) => {
            if (
              notification.isNotDisplayed() ||
              notification.isSkippedMoment()
            ) {
              // continue with another identity provider.
              console.log("One Tap isn't supported in this browser");
              showLoginDialog();
            }
          });
        }
      } else {
        showLoginDialog();
      }
    }
  };

  return { signIn, loading: authenticating };
};

export default useLogin;
