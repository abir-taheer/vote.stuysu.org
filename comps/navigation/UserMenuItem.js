import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import React, { useContext, useState } from "react";
import gaEvent from "../../utils/analytics/gaEvent";
import UserContext from "../auth/UserContext";

const styles = {
  button: {
    color: "black",
    margin: "0 0.5rem",
  },
  popover: {
    padding: "1rem",
  },
};

const UserMenuItem = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useContext(UserContext);

  return (
    <>
      <Button
        disableRipple
        onClick={(ev) => {
          setAnchorEl(anchorEl ? null : ev.target);
          gaEvent({
            category: "click",
            action: "user menu item",
            label: "user menu item toggled",
            nonInteraction: false,
          });
        }}
        endIcon={<ArrowDropDown />}
        sx={styles.button}
      >
        Hi {user.firstName}
      </Button>

      <Popover
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onBackdropClick={() => {
          setAnchorEl(null);
          gaEvent({
            category: "click",
            action: "backdrop click",
            label: "user menu item closed",
            nonInteraction: false,
          });
        }}
      >
        <div style={styles.popover}>
          <p>
            You&apos;re signed in as: <b>{user.name}</b>
          </p>
          <p>
            Email: <b>{user.email}</b>
          </p>
          <p>
            Graduation Year: <b>{user.gradYear}</b>
          </p>
          <p>
            Grade: <b>{user.grade}</b>
          </p>
          <Button
            fullWidth
            variant={"outlined"}
            color={"primary"}
            onClick={user.logout}
          >
            Sign Out
          </Button>
        </div>
      </Popover>
    </>
  );
};

export default UserMenuItem;
