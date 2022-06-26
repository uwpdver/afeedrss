import React from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { initializeIcons, ThemeProvider } from "@fluentui/react";
import "../styles/globals.css";
import { lightTheme, darkTheme } from "../theme";

initializeIcons();
const isDarkMode = false;

interface GlobalSettings {
  showFeedThumbnail: boolean;
}
const defaultGlobalSettings = {
  showFeedThumbnail: true,
};
export const GlobalSettingsCtx = React.createContext<{
  setGlobalSettings: React.Dispatch<React.SetStateAction<GlobalSettings>>;
  globalSettings: GlobalSettings;
}>({
  setGlobalSettings: () => {},
  globalSettings: defaultGlobalSettings,
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  const [globalSettings, setGlobalSettings] = React.useState<GlobalSettings>(
    defaultGlobalSettings
  );
  const theme = isDarkMode ? darkTheme : lightTheme;
  return (
    <SessionProvider session={session}>
      <Head>
        <meta name="referrer" content="no-referrer" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <GlobalSettingsCtx.Provider
            value={{ globalSettings, setGlobalSettings }}
          >
            <Component {...pageProps} />
          </GlobalSettingsCtx.Provider>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
