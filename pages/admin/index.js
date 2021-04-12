import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/election");
  });

  return null;
}
