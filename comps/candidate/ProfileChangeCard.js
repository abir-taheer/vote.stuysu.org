import { CancelOutlined } from "@mui/icons-material";
import { CardActions, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useState } from "react";
import layout from "../../styles/layout.module.css";
import useFormatDate from "../../utils/date/useFormatDate";

export default function ProfileChangeCard({
  field,
  createdBy,
  createdAt,
  reviewed,
  approved,
  reasonForRejection,
  reviewedAt,
  picture,
  value,
  candidate,
  showApproveButton,
  showRejectButton,
  showCancelButton,
  onApproval,
  onRejection,
  onCancel,
  disabled,
}) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const { getReadableDate } = useFormatDate(false);
  return (
    <Card sx={{ padding: 2 }}>
      <div style={{ padding: "0.75rem" }}>
        <Typography variant={"body1"}>
          <b>{createdBy.name}</b> requested to change the{" "}
          <b>{field === "pictureId" ? "picture" : field}</b> for{" "}
          <Typography variant={"body1"} color={"primary"} component={"span"}>
            {candidate.name}
          </Typography>
        </Typography>
        <Typography variant={"body2"} color={"text.secondary"}>
          Created {getReadableDate(createdAt)}
        </Typography>
        <Typography variant={"body2"} color={"text.secondary"}>
          Status:{" "}
          {reviewed ? (
            approved ? (
              <Typography
                variant={"inherit"}
                color={"green"}
                component={"span"}
              >
                Approved
              </Typography>
            ) : (
              <Typography
                variant={"inherit"}
                color={"error"}
                component={"span"}
              >
                Rejected
              </Typography>
            )
          ) : (
            <Typography
              variant={"inherit"}
              color={"primary"}
              component={"span"}
            >
              Not Yet Reviewed
            </Typography>
          )}
        </Typography>

        {!approved && reasonForRejection && (
          <Typography variant={"body2"} color={"error"}>
            <Typography
              variant={"inherit"}
              color={"text.secondary"}
              component={"span"}
            >
              Reason for rejection:
            </Typography>{" "}
            {reasonForRejection}
          </Typography>
        )}

        {reviewed && (
          <Typography variant={"body2"} color={"text.secondary"}>
            Reviewed {getReadableDate(reviewedAt)}
          </Typography>
        )}

        <Typography variant={"body1"} color={"text.secondary"}>
          New {field === "pictureId" ? "picture" : field}:
        </Typography>

        <Divider />

        {field === "blurb" && <Typography>{value}</Typography>}

        {field === "platform" && (
          <div dangerouslySetInnerHTML={{ __html: value }} />
        )}

        {field === "pictureId" && (
          <div style={{ margin: "1rem" }}>
            <Image
              src={picture.resource.url}
              alt={picture.alt}
              height={200}
              width={200}
              className={layout.candidatePicture}
            />
          </div>
        )}
      </div>

      <CardActions>
        {rejecting ? (
          <div>
            <TextField
              variant={"outlined"}
              fullWidth
              rows={3}
              multiline
              disabled={disabled}
              value={reason}
              label={"Reason for rejecting"}
              onChange={(e) => setReason(e.target.value)}
            />
            <Stack spacing={2} direction={"row"}>
              <Button
                variant={"contained"}
                color={"error"}
                disabled={disabled}
                onClick={onRejection}
              >
                Reject
              </Button>

              <Button
                variant={"outlined"}
                color={"warning"}
                disabled={disabled}
                onClick={() => setRejecting(false)}
              >
                Cancel
              </Button>
            </Stack>
          </div>
        ) : (
          <Stack direction={"row"} spacing={2}>
            {showCancelButton && (
              <Button
                startIcon={<CancelOutlined />}
                variant={"contained"}
                color={"error"}
                onClick={onCancel}
                disabled={disabled}
              >
                Cancel Changes
              </Button>
            )}

            {showApproveButton && (
              <Button
                variant={"contained"}
                onClick={onApproval}
                color={"secondary"}
                disabled={disabled}
              >
                Approve
              </Button>
            )}

            {showRejectButton && (
              <Button
                variant={"outlined"}
                color={"error"}
                disabled={disabled}
                onClick={() => setRejecting(true)}
              >
                Reject
              </Button>
            )}
          </Stack>
        )}
      </CardActions>
    </Card>
  );
}
