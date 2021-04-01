import Head from "next/head";
import layout from "./../styles/layout.module.css";
import searching from "./../img/searching-with-dog.png";
import Link from "next/link";
import Button from "@material-ui/core/Button";
import HomeOutlined from "@material-ui/icons/HomeOutlined";
import { useTheme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const Error404 = () => {
  const theme = useTheme();
  const title = "Page Not Found | StuyBOE Voting Site";
  const description = "That page could not be found on this site";
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="theme-color" content={theme.palette.primary.main} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:image" content={searching} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="912" />
        <meta
          property="og:image:alt"
          content="Someone with a magnifying glass looking at the ground"
        />
      </Head>
      <div className={layout.container}>
        <main className={layout.main}>
          <img
            src={searching}
            className={layout.largeVector}
            alt={"Someone with a magnifying glass looking at the ground"}
          />
          <Typography variant={"h1"} align={"center"}>
            Page not found
          </Typography>
          <Link href={"/"}>
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
