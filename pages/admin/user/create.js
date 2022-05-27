import { gql, useMutation } from "@apollo/client";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import alertDialog from "../../../comps/dialog/alertDialog";
import BackButton from "../../../comps/shared/BackButton";
import UserForm from "../../../comps/user/form/UserForm";
import layout from "./../../../styles/layout.module.css";

const MUTATION = gql`
  mutation (
    $firstName: NonEmptyString!
    $lastName: NonEmptyString!
    $email: EmailAddress!
    $gradYear: PositiveInt
    $adminPrivileges: Boolean!
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      gradYear: $gradYear
      adminPrivileges: $adminPrivileges
    ) {
      id
    }
  }
`;

const Create = () => {
  const [create] = useMutation(MUTATION);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (
    { firstName, lastName, email, gradYear, adminPrivileges },
    { setSubmitting }
  ) => {
    try {
      const { data } = await create({
        variables: {
          firstName,
          lastName,
          email,
          gradYear: gradYear || null,
          adminPrivileges,
        },
      });

      await enqueueSnackbar("Successfully created user", {
        variant: "success",
      });

      await router.push("/admin/user/edit/" + data.createUser.id);
    } catch (e) {
      alertDialog({ title: "Error creating user", body: e.message });
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth={"md"} className={layout.page}>
      <BackButton href={"/admin/user"} text={"Back To Users"} />

      <Typography variant={"h1"} align={"center"}>
        Create User |{" "}
        <Typography variant="inherit" component={"span"} color="secondary">
          Admin Panel
        </Typography>
      </Typography>

      <AdminTabBar />

      <UserForm submitLabel={"Create"} onSubmit={handleSubmit} />
    </Container>
  );
};

export default Create;
