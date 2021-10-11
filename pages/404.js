import HomeOutlined from "@mui/icons-material/HomeOutlined";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PUBLIC_URL } from "../constants";
import get404Image from "../utils/errors/get404Image";
import defaultImage from "./../img/404-images/searching-with-dog.png";
import layout from "./../styles/layout.module.css";

const Error404 = () => {
  const title = "Page Not Found | StuyBOE Voting Site";
  const description = "That page could not be found on this site";
  const [image, setImage] = useState(null);

  useEffect(() => {
    setImage(get404Image());
  }, []);

  // Server side url class is undefined on client so choose based on which is available
  const URL = globalThis?.URL;

  const defaultImageUrl = new URL(defaultImage.src, PUBLIC_URL).href;

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
          <Link href={"/"} styles={layout.spaced} passHref>
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
