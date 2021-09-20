export const GOOGLE_CLIENT_ID =
  process.env.NEXT_APP_GOOGLE_CLIENT_ID ||
  "665058591652-24kl39va132h027284rpdprhstt0at7d.apps.googleusercontent.com";

export const PUBLIC_URL =
  process.env.PUBLIC_URL || process.env.NODE_ENV === "production"
    ? "https://vote.stuysu.org"
    : "https://localhost:3000";
