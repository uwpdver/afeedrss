import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { initializeIcons, ThemeProvider } from "@fluentui/react";
import Helmet from "react-helmet";
import { lightTheme, darkTheme } from "../theme";

initializeIcons();

const isDarkMode = false;

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());
  const theme = isDarkMode ? darkTheme : lightTheme;
  return (
    <SessionProvider session={session}>
      <Helmet>
        <meta name="referrer" content="no-referrer" />
      </Helmet>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
