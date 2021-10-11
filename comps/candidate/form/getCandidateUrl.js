export default function getCandidateUrl(val) {
  return val
    .toLowerCase()
    .replace(/[^a-z0-9-& ]/g, "")
    .split(/ +(?:and|&) +/i)
    .map((a) => a.split(/ +/).filter(Boolean)[0])
    .join("-");
}
