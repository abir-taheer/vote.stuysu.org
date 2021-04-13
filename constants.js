export const GOOGLE_CLIENT_ID =
  process.env.NEXT_APP_GOOGLE_CLIENT_ID || process.env.NODE_ENV === "production"
    ? "665058591652-nip7dff0g61g7n69lf3bgkvj16i9j6dm.apps.googleusercontent.com"
    : "665058591652-jorca8bro1h1g11875qpef466tts0ebd.apps.googleusercontent.com";

export const PUBLIC_URL =
  process.env.PUBLIC_URL || process.env.NODE_ENV === "production"
    ? "https://vote.stuysu.org"
    : "http://localhost:3000";
