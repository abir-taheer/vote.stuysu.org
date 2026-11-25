const STUY_ACTIVITIES_VOTER_EXPORT_URL =
  "https://base.stuysu.org/functions/v1/export-voters";
const LEGACY_VOTER_EXPORT_ROW_LIMIT = 1000;

/** Fetch the StuyActivities voter roster before syncing any users. */
export default async function fetchStuyActivitiesVoters(token) {
  const response = await fetch(STUY_ACTIVITIES_VOTER_EXPORT_URL, {
    headers: { authorization: "Bearer " + token },
  });

  if (!response.ok) {
    throw new Error(`Voter export returned HTTP ${response.status}.`);
  }

  const { success, data } = (await response.json()) ?? {};
  if (success !== true || !Array.isArray(data)) {
    throw new Error("Voter export did not return a valid roster.");
  }

  // The old exporter silently stopped at 1,000 rows. The API has no total
  // count, so a complete roster of exactly 1,000 rows is also ambiguous.
  if (data.length === LEGACY_VOTER_EXPORT_ROW_LIMIT) {
    throw new Error(
      "Voter export returned exactly 1,000 rows and may be incomplete. Ask the StuyActivities team to verify the roster and exporter pagination before syncing again."
    );
  }

  return data;
}
