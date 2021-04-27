import Document, { Head, Html, Main, NextScript } from "next/document";

const SOURCE_GREETING = `<!--
Hi there :)
            
If you're looking for the source code, this might not be that useful
This site was created with Next.JS, a framework built on React.JS
The code you see here has been compiled and minified and isn't very readable
If you're interested in learning more about the site visit https://vote.stuysu.org/about
The source code is also open-source and available here: https://github.com/abir-taheer/vote.stuysu.org
            
Stay Curious,
Abir 


             *     ,MMM8&&&.            *
                  MMMM88&&&&&    .
                 MMMM88&&&&&&&
     *           MMM88&&&&&&&&
                 MMM88&&&&&&&&
                 'MMM88&&&&&&'
                   'MMM8&&&'      *
          |\\___/|
          )     (             .              '
         =\\     /=
           )===(       *
          /     \\
          |     |
         /       \\
         \\       /
  _/\\_/\\_/\\__  _/_/\\_/\\_/\\_/\\_/\\_/\\_/\\_/\\_/\\_
  |  |  |  |( (  |  |  |  |  |  |  |  |  |  |
  |  |  |  | ) ) |  |  |  |  |  |  |  |  |  |
  |  |  |  |(_(  |  |  |  |  |  |  |  |  |  |
  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
  
Art By Joan G. Stark
-->`;

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang={"end"}>
        <Head />
        <body>
          <div
            dangerouslySetInnerHTML={{
              __html: SOURCE_GREETING,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
