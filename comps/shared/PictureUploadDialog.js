import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import CameraAlt from "@material-ui/icons/CameraAlt";
import Close from "@material-ui/icons/Close";
import EventEmitter from "events";
import { createRef, useEffect, useState } from "react";
import styles from "./PictureUploadDialog.module.css";

const pictureDialogEmitter = new EventEmitter();

export function promptPicture(file) {
  return new Promise((resolve, reject) => {
    pictureDialogEmitter.emit("prompt", { resolve, reject, file });
  });
}

const PictureUploadDialog = () => {
  const [open, setOpen] = useState(false);
  const [promise, setPromise] = useState(null);
  const [file, setFile] = useState(null);
  const [alt, setAlt] = useState("");
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
    resetValues();
  };

  const handleConfirm = () => {
    promise.resolve({ file, alt });
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
          <div className={styles.imageContainer}>
            <img
              src={window.URL.createObjectURL(file)}
              alt={alt}
              className={styles.image}
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
            "Briefly the image. This will appear if the image fails to load or for people with assistive readers."
          }
          fullWidth
          className={styles.altInput}
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
