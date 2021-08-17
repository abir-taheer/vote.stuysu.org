import { useEffect, useRef } from "react";
import useScript from "./useScript";

export default function LoginButton() {
  const scriptStatus = useScript("https://accounts.google.com/gsi/client");
  const ref = useRef(null);

  useEffect(() => {
    const scriptLoaded = scriptStatus === "ready" || scriptStatus === "idle";
    if (scriptLoaded && ref.current && globalThis?.google) {
      globalThis.google.accounts.id.renderButton(ref.current, {
        theme: "outline",
        size: "large",
      });
    }
  });

  return <div ref={ref} />;
}
