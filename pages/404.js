import Head from "next/head";
import layout from "./../styles/layout.module.css";
import Link from "next/link";
import Button from "@material-ui/core/Button";
import HomeOutlined from "@material-ui/icons/HomeOutlined";
import { useTheme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import get404Image from "../utils/errors/get404Image";
import { PUBLIC_URL } from "../constants";

import { URL } from "url";

const Error404 = () => {
  const theme = useTheme();
  const title = "Page Not Found | StuyBOE Voting Site";
  const description = "That page could not be found on this site";
  const image = get404Image();

  // Server side url class is undefined on client so choose based on which is available
  const Url = globalThis?.URL || URL;

  const url = new Url(image.src, PUBLIC_URL).href;

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="theme-color" content={theme.palette.primary.main} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:image" content={url} />
        <meta property="og:image:width" content={image.width} />
        <meta property="og:image:height" content={image.height} />
        <meta property="og:image:alt" content={image.alt} />
      </Head>
      <div className={layout.container}>
        <main className={layout.main}>
          <img src={image.src} className={layout.largeVector} alt={image.alt} />

          <Typography variant={"h1"} align={"center"}>
            Page not found
          </Typography>

          <Link href={"/"} styles={layout.spaced}>
            <Button
              startIcon={<HomeOutlined />}
              color={"secondary"}
              variant={"contained"}
            >
              Go Back Home
            </Button>
          </Link>
        </main>
      </div>
    </div>
  );
};

export default Error404;
