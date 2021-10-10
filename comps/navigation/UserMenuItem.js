import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import React, { useContext, useState } from "react";
import UserContext from "../auth/UserContext";
import styles from "./NavBar.module.css";

const UserMenuItem = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useContext(UserContext);

  return (
    <>
      <Button
        disableRipple
        onClick={(ev) => setAnchorEl(anchorEl ? null : ev.target)}
        endIcon={<ArrowDropDown />}
        sx={{ color: "black", margin: "0 0.5rem" }}
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
        onBackdropClick={() => setAnchorEl(null)}
      >
        <div className={styles.userItemPopover}>
          <p>
            You're signed in as: <b>{user.name}</b>
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
