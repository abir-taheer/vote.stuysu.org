import ReactGA from "react-ga4";

export default function gaEvent({ category, action, label, nonInteraction }) {
  if (globalThis.window) {
    ReactGA.event({
      category,
      action,
      label,
      nonInteraction,
    });
  }
}
