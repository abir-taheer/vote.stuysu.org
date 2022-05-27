import { gql, useMutation, useQuery } from "@apollo/client";
import AddOutlined from "@mui/icons-material/AddOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import WarningOutlined from "@mui/icons-material/WarningOutlined";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { Fragment } from "react";
import AdminCandidateTabBar from "../../../../../comps/admin/AdminCandidateTabBar";
import AdminTabBar from "../../../../../comps/admin/AdminTabBar";
import alertDialog from "../../../../../comps/dialog/alertDialog";
import confirmDialog from "../../../../../comps/dialog/confirmDialog";
import BackButton from "../../../../../comps/shared/BackButton";
import LoadingScreen from "../../../../../comps/shared/LoadingScreen";
import useFormatDate from "../../../../../utils/date/useFormatDate";
import Error404 from "../../../../404";
import layout from "./../../../../../styles/layout.module.css";

const MUTATION = gql`
  mutation ($candidateId: ObjectID!, $strikeId: ObjectID!) {
    deleteStrike(candidateId: $candidateId, strikeId: $strikeId)
  }
`;

const QUERY = gql`
  query ($id: ObjectID!) {
    candidateById(id: $id) {
      id
      name
      url
      strikes {
        id
        weight
        reason
        updatedAt
        createdAt
      }
    }
  }
`;

const AlterStrike = () => {
  const router = useRouter();
  const { id } = router.query;
  const { getReadableDate } = useFormatDate(false);
  const { data, loading, refetch } = useQuery(QUERY, {
    variables: { id },
    fetchPolicy: "network-only",
  });
  const [remove, { loading: removing }] = useMutation(MUTATION);
  const { enqueueSnackbar } = useSnackbar();

  const handleRemove = async (strikeId) => {
    const confirmation = await confirmDialog({
      title: "Confirm deletion",
      body: "Are you sure you want to remove this strike?",
    });

    if (confirmation) {
      try {
        await remove({ variables: { candidateId: id, strikeId } });

        await refetch();
        enqueueSnackbar("Successfully removed the strike", {
          variant: "success",
        });
      } catch (e) {
        await alertDialog({ title: "Error removing strike", body: e.message });
      }
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const candidate = data.candidateById;

  if (!candidate) {
    return <Error404 />;
  }

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <BackButton
        href={"/admin/candidate/" + id}
        text={"Back To " + candidate.name}
      />

      <Typography variant={"h1"} align={"center"}>
        Strikes |{" "}
        <Typography variant="inherit" component={"span"} color="secondary">
          Admin Panel
        </Typography>
      </Typography>

      <AdminTabBar />

      <Typography variant={"h2"} color={"secondary"} align={"center"}>
        {candidate.name}
      </Typography>

      <AdminCandidateTabBar />

      <div className={layout.center}>
        <Link href={"/admin/candidate/" + id + "/strike/create"} passHref>
          <Button
            variant={"outlined"}
            color={"secondary"}
            startIcon={<AddOutlined />}
          >
            Create Strike
          </Button>
        </Link>
      </div>

      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {candidate.strikes.map((strike, index) => (
          <Fragment key={strike.id}>
            <ListItem>
              <ListItemIcon>
                <WarningOutlined />
              </ListItemIcon>
              <ListItemText>
                <Typography variant={"h3"} color={"primary"}>
                  <b>{getReadableDate(strike.updatedAt)}</b>
                </Typography>

                <Typography variant="body1" gutterBottom>
                  Weight:{" "}
                  <Typography component="span" variant="inherit" color="error">
                    {strike.weight}
                  </Typography>
                </Typography>
                <Typography variant="body1" component={"span"}>
                  Reason:{" "}
                  <Typography
                    variant="body1"
                    component={"span"}
                    color={"text.secondary"}
                  >
                    {strike.reason}
                  </Typography>
                </Typography>
              </ListItemText>
              <ListItemSecondaryAction>
                <Link
                  href={"/admin/candidate/" + id + "/strike/" + strike.id}
                  passHref
                >
                  <IconButton sx={{ margin: "0.5rem" }} disabled={removing}>
                    <EditOutlined />
                  </IconButton>
                </Link>
                <IconButton
                  color={"error"}
                  sx={{ margin: "0.5rem" }}
                  onClick={() => handleRemove(strike.id)}
                  disabled={removing}
                >
                  <DeleteOutlined />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>

            {index < candidate.strikes.length - 1 && <Divider />}
          </Fragment>
        ))}
      </List>
    </Container>
  );
};

export default AlterStrike;
