import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import HomeOutlined from "@material-ui/icons/HomeOutlined";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { URL } from "url";
import { PUBLIC_URL } from "../constants";
import get404Image from "../utils/errors/get404Image";
import defaultImage from "./../img/404-images/searching-with-dog.png";
import layout from "./../styles/layout.module.css";

const Error404 = () => {
  const theme = useTheme();
  const title = "Page Not Found | StuyBOE Voting Site";
  const description = "That page could not be found on this site";
  const [image, setImage] = useState(null);

  useEffect(() => {
    setImage(get404Image());
  }, []);

  // Server side url class is undefined on client so choose based on which is available
  const Url = globalThis?.URL || URL;

  const defaultImageUrl = new Url(defaultImage.src, PUBLIC_URL).href;

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:image" content={defaultImageUrl} />
        <meta property="og:image:width" content={912} />
        <meta property="og:image:height" content={912} />
        <meta
          property="og:image:alt"
          content={"Someone with their dog, looking for something"}
        />
      </Head>
      <Container className={layout.page} maxWidth={"md"}>
        {image && (
          <div className={layout.center}>
            <Image
              src={image.src}
              alt={image.alt}
              width={300}
              height={(300 / image.width) * image.height}
            />
          </div>
        )}

        <Typography variant={"h1"} align={"center"}>
          Page not found
        </Typography>

        <div className={layout.center}>
          <Link href={"/"} styles={layout.spaced}>
            <Button
              startIcon={<HomeOutlined />}
              color={"secondary"}
              variant={"contained"}
            >
              Go Back Home
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default Error404;
