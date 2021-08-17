import alertDialog from "../dialog/alertDialog";
import layout from "./../../styles/layout.module.css";

import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import LoginButton from "./LoginButton";
import { CircularProgress } from "@material-ui/core";
import useGSI from "./useGSI";

const useLogin = () => {
  const { ready, authenticating } = useGSI();

  const signIn = () => {
    {
      if (ready) {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // continue with another identity provider.
            console.log("One Tap isn't supported in this browser");
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
                    Click the "Sign In With Google" button on the below and sign
                    in using your <b>@stuy.edu</b> email address.
                  </Typography>
                  <Typography variant={"body1"}>
                    If the login popup doesn't open, refresh the page and try
                    again or contact stuyboe@gmail.com
                  </Typography>

                  <div className={layout.flexCenter}>
                    {authenticating ? <CircularProgress /> : <LoginButton />}
                  </div>
                </div>
              ),
            });
          }
        });
      }
    }
  };

  return { signIn, loading: authenticating };
};

export default useLogin;
