const capitalize = (str, everyWord = false) => {
  if (everyWord) {
    return str.replace(/\b[a-z]/g, (char) => char.toUpperCase());
  }

  const [first, ...rest] = str;
  return first.toUpperCase() + rest.join("");
};

export default capitalize;
