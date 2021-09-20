import axios from "axios";

export default async function uploadPicture(picture, alt) {
  const jwt = localStorage.getItem("jwt");

  const formData = new FormData();
  formData.append("file", picture);
  formData.append("alt", alt);

  const config = {
    method: "post",
    url: "/api/upload",
    headers: {
      Authorization: jwt,
    },
    data: formData,
  };

  const { data } = await axios(config);

  return data;
}
