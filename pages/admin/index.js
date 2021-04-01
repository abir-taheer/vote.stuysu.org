import AdminRequired from "../../comps/auth/AdminRequired";

export default function Admin() {
  return (
    <AdminRequired>
      <p>hi</p>
    </AdminRequired>
  );
}
