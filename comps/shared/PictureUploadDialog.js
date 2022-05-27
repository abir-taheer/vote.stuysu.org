import CameraAlt from "@mui/icons-material/CameraAlt";
import Close from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import EventEmitter from "events";
import { useRouter } from "next/router";
import { createRef, useEffect, useState } from "react";
import gaEvent from "../../utils/analytics/gaEvent";

const pictureDialogEmitter = new EventEmitter();

export function promptPicture(file) {
  return new Promise((resolve, reject) => {
    pictureDialogEmitter.emit("prompt", { resolve, reject, file });
  });
}

const styles = {
  imageContainer: {
    width: "300px",
    maxHeight: "400px",
    height: "200px",
    maxWidth: "100%",
  },

  image: {
    maxWidth: "100%",
    maxHeight: "85%",
    objectFit: "contain",
  },

  altInput: {
    margin: "1rem 0",
  },
};

const PictureUploadDialog = () => {
  const [open, setOpen] = useState(false);
  const [promise, setPromise] = useState(null);
  const [file, setFile] = useState(null);
  const [alt, setAlt] = useState("");
  const router = useRouter();
  const uploadRef = createRef();

  const resetValues = () => {
    setFile(null);
    setPromise(null);
    setAlt("");
    setOpen(false);
  };

  const handleClickOut = () => {
    promise.resolve(null);
    setOpen(false);
  };

  const handleCancel = () => {
    promise.resolve(null);
    gaEvent({
      category: "picture",
      action: "picture upload cancelled",
      label: router.asPath,
      nonInteraction: false,
    });
    resetValues();
  };

  const handleConfirm = () => {
    promise.resolve({ file, alt });

    gaEvent({
      category: "picture",
      action: "picture uploaded",
      label: router.asPath,
      nonInteraction: false,
    });
    resetValues();
  };

  useEffect(() => {
    const handler = (params) => {
      const { reject, resolve } = params;
      setPromise({ resolve, reject });
      if (params.file) {
        setFile(params.file);
      }
      setOpen(true);
    };

    pictureDialogEmitter.on("prompt", handler);

    return () => pictureDialogEmitter.removeListener("prompt", handler);
  });

  return (
    <Dialog open={open} onClose={handleClickOut}>
      <DialogTitle>Upload A Picture</DialogTitle>
      <DialogContent>
        {file && (
          <div style={styles.imageContainer}>
            <img
              src={window.URL.createObjectURL(file)}
              alt={alt}
              style={styles.image}
              height={200}
              width={300}
            />
            <br />
            <Button
              style={{ color: "secondary" }}
              variant={"outlined"}
              onClick={() => setFile(null)}
            >
              <Close /> Clear Uploaded File
            </Button>
          </div>
        )}

        <input
          type={"file"}
          onChange={(ev) => setFile(ev.target.files[0])}
          accept={"image/*"}
          style={{ display: "none" }}
          ref={uploadRef}
        />
        {!file && (
          <Button
            variant={"contained"}
            color={"secondary"}
            onClick={() => uploadRef.current && uploadRef.current.click()}
            disabled={Boolean(file)}
          >
            <CameraAlt />
            &nbsp;&nbsp;Upload File From Your Device
          </Button>
        )}

        <TextField
          value={alt}
          onChange={(ev) => setAlt(ev.target.value)}
          label={"Alt Text"}
          variant={"outlined"}
          placeholder={"e.g. people smiling in front of a bridge"}
          helperText={
            "Briefly describe the image. This will appear if the image fails to load or for people with assistive readers."
          }
          fullWidth
          sx={styles.altInput}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          autoFocus
          disabled={!Boolean(file) || !Boolean(alt)}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PictureUploadDialog;
