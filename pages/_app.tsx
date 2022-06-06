import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import Helmet from 'react-helmet';

initializeIcons();

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <SessionProvider session={session}>
      <Helmet >
        <meta name="referrer" content="no-referrer" />
      </Helmet>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
