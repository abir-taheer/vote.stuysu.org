import conifer404 from "../../img/404-images/conifer-404.png";
import coniferNotFound from "../../img/404-images/conifer-page-not-found.png";
import eastwoodListIsEmpty from "../../img/404-images/eastwood-list-is-empty.png";
import hugoPageNotFound from "../../img/404-images/hugo-page-not-found.png";
import pablitaNotFound from "../../img/404-images/pablita-318.png";
import pabloNotFound from "../../img/404-images/pablo-975.png";
import paleListIsEmpty from "../../img/404-images/pale-list-is-empty.png";
import searchingWithDog from "../../img/404-images/searching-with-dog.png";

const images = [
  {
    src: conifer404,
    alt: "Someone with a magnifying glass standing in front of a browser tab",
    height: 912,
    width: 912,
  },
  {
    src: coniferNotFound,
    alt: "Someone using a flashlight to project the number 404 in the sky",
    height: 912,
    width: 912,
  },
  {
    src: eastwoodListIsEmpty,
    alt: "A group of people standing in front of an empty canvas",
    height: 912,
    width: 1216,
  },
  {
    src: hugoPageNotFound,
    alt: "Someone in a ghost costume",
    height: 912,
    width: 1216,
  },
  {
    src: pablitaNotFound,
    alt: "Someone scratching their head",
    height: 912,
    width: 1343,
  },
  {
    src: pabloNotFound,
    alt: "Someone scratching their head next to a browser tab",
    height: 912,
    width: 1367,
  },
  {
    src: paleListIsEmpty,
    alt: "Someone in front of an empty canvas",
    height: 912,
    width: 1216,
  },
  {
    src: searchingWithDog,
    alt: "Someone with their dog, looking for something",
    height: 912,
    width: 1216,
  },
];

export default function get404Image() {
  const index = Math.floor(Math.random() * images.length);

  return images[index];
}
