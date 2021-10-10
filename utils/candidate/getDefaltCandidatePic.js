const backgroundColors = [
  "00b894",
  "6c5ce7",
  "00cec9",
  "ff7675",
  "74b9ff",
  "fd79a8",
];

export default function getDefaultCandidatePic(str) {
  // The url module doesn't work on the client so use the browser url class
  const Url = globalThis.URL;
  const name = str || "john-alex";
  const colorIndex =
    (name.length * name.charCodeAt(0)) % backgroundColors.length;

  const background = backgroundColors[colorIndex];
  let url = new Url("https://ui-avatars.com/api/");
  let params = url.searchParams;

  const names = name.split(/\W/).filter(Boolean);

  params.append("size", "512");
  params.append("font-size", "0.35");
  params.append("color", "ffffff");
  params.append("name", names.join(" "));
  params.append("background", background);
  params.append("length", names.length.toString());

  return url.toString();
}
