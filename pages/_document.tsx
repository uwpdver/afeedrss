import React from "react";
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { Stylesheet, resetIds } from "@fluentui/react";

const stylesheet = Stylesheet.getInstance();

export default class MyDocument extends Document<{
  styleTags: any;
  serializedStylesheet: any;
}> {
  static async getInitialProps(ctx: DocumentContext) {
    resetIds();
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styleTags: stylesheet.getRules(true),
      serializedStylesheet: stylesheet.serialize(),
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <style
            type="text/css"
            dangerouslySetInnerHTML={{ __html: this.props.styleTags }}
          />
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
            window.FabricConfig = window.FabricConfig || {};
            window.FabricConfig.serializedStylesheet = ${this.props.serializedStylesheet};
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
