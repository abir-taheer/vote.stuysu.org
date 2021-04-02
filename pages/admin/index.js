export async function getServerSideProps({ res }) {
  res.statusCode = 302;
  res.setHeader("Location", `/admin/elections`); // Replace <link> with your url link
  return { props: {} };
}

export default function AdminRedirect() {
  return null;
}
