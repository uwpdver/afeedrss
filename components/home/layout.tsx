import React, { useState } from "react";
import Link from "next/link";
import { IconButton, Stack, StackItem, Image, Text } from "@fluentui/react";

import SourcesPanel from "../sourcePanel";
import { useSession } from "next-auth/react";

interface Props {
  children?: React.ReactNode;
}

interface GlobalNavigation {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const defaultGlobalNavigation = {
  isOpen: false,
  setIsOpen: () => {},
};
export const GlobalNavigationCtx = React.createContext<GlobalNavigation>(
  defaultGlobalNavigation
);

export default function Layout({ children }: Props) {
  const [isNavigationPanelOpen, setIsNavigationPanelOpen] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  return (
    <GlobalNavigationCtx.Provider
      value={{
        isOpen: isNavigationPanelOpen,
        setIsOpen: setIsNavigationPanelOpen,
      }}
    >
      <Stack
        horizontal
        className="relative h-screen overflow-hidden bg-gray-100 sm:pl-[288px]"
      >
        {isNavigationPanelOpen && (
          <div
            className="bg-black/50 fixed inset-0 z-20 cursor-pointer"
            onClick={() => setIsNavigationPanelOpen(false)}
          />
        )}
        <Stack
          grow
          className={`fixed left-0 top-0 bottom-0 z-20 bg-gray-100 w-[calc(100% - 64px)] sm:w-[288px] transition-transform sm:translate-x-0 delay-100 ${
            isNavigationPanelOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Stack
            disableShrink
            className="px-4 py-4"
            horizontal
            verticalAlign="center"
            horizontalAlign="space-between"
          >
            <StackItem disableShrink>
              <Image
                src=""
                alt=""
                className="w-12 h-12 rounded-full bg-gray-400 mr-4"
              />
            </StackItem>
            <StackItem grow disableShrink>
              <Text className="text-lg font-bold" block>
                {session?.user?.name}
              </Text>
              <Text className="text-base text-gray-400">
                {session?.user?.email}
              </Text>
            </StackItem>
            <StackItem disableShrink>
              <Link href="/settings" passHref>
                <a>
                  <IconButton iconProps={{ iconName: "Settings" }} />
                </a>
              </Link>
            </StackItem>
          </Stack>

          <Stack className="sticky top-0 overflow-y-hidden" grow>
            <div className="overflow-y-scroll scrollbar flex-1">
              <SourcesPanel userId={userId} />
            </div>
          </Stack>
        </Stack>
        <Stack className="bg-gray-200" grow horizontalAlign="center">
          <Stack className="w-full max-w-4xl 2xl:max-w-5xl  bg-gray-50 relative h-full overflow-x-hidden">
            {children}
          </Stack>
        </Stack>
      </Stack>
    </GlobalNavigationCtx.Provider>
  );
}

export const getLayout = (page: React.ReactElement): React.ReactElement => (
  <Layout>{page}</Layout>
);
