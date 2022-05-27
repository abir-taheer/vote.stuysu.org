import CircularProgress from "@mui/material/CircularProgress";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import gaEvent from "../../utils/analytics/gaEvent";
import alertDialog from "../dialog/alertDialog";
import layout from "./../../styles/layout.module.css";
import LoginButton from "./LoginButton";
import useGSI from "./useGSI";

const useLogin = () => {
  const [showedOneTap, setShowedOneTap] = useState(false);
  const { ready, authenticating } = useGSI();

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
            Click the &quot;Sign In With Google&quot; button on the below and
            sign in using your <b>@stuy.edu</b> email address.
          </Typography>
          <Typography variant={"body1"}>
            If the login popup doesn&apos;t open, refresh the page and try again
            or contact stuyboe@gmail.com
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
        let showedPrompt = false;

        if (showedOneTap) {
          showLoginDialog();
          showedPrompt = true;
        }

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // continue with another identity provider.
            console.log("One Tap isn't supported in this browser");
            if (!showedPrompt) {
              showLoginDialog();
              gaEvent({
                category: "authentication",
                action: "success",
                label: "Dialog prompt was displayed",
                nonInteraction: false,
              });
            }

            gaEvent({
              category: "authentication",
              action: "error",
              label: "One tap prompt not displayed",
              nonInteraction: true,
            });
          } else {
            gaEvent({
              category: "authentication",
              action: "success",
              label: "One tap prompt displayed",
              nonInteraction: true,
            });
          }
        });

        setShowedOneTap(true);
      }
    }
  };

  return { signIn, loading: authenticating };
};

export default useLogin;
