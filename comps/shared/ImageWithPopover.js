import { useState } from "react";
import styles from "./ImageWithPopover.module.css";
import Popover from "material-ui-popup-state/HoverPopover";
import {
  usePopupState,
  bindHover,
  bindPopover,
} from "material-ui-popup-state/hooks";

const ImageWithPopover = ({
  src,
  alt,
  popover,
  enterDelay,
  leaveDelay,
  style,
  className,
  center,
}) => {
  const popupState = usePopupState({
    variant: "popover",
    popupId: "image-popup" + src,
  });

  return (
    <div style={{ textAlign: center ? "center" : "" }}>
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        {...bindHover(popupState)}
      />
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        classes={{
          paper: styles.paper,
        }}
        transitionDuration={400}
        disableRestoreFocus
        children={popover}
      />
    </div>
  );
};

export default ImageWithPopover;
