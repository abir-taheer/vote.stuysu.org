import layout from "./../../../styles/layout.module.css";
import Typography from "@material-ui/core/Typography";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import UserForm from "../../../comps/user/UserForm";
import { gql } from "@apollo/client/core";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import alertDialog from "../../../comps/dialog/alertDialog";

const MUTATION = gql`
  mutation(
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
    <div className={layout.container}>
      <main className={layout.main}>
        <Typography variant={"h1"}>Create User | Admin Panel</Typography>
        <AdminTabBar />
        <UserForm submitLabel={"Create"} onSubmit={handleSubmit} />
      </main>
    </div>
  );
};

export default Create;
