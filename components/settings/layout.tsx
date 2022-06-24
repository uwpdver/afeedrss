import React from "react";
import { Text, Stack, StackItem, IconButton } from "@fluentui/react";
import Link from "next/link";
import Head from "next/head";
import Nav from "./nav";

interface Props {
  title?: string;
  children?: React.ReactNode;
  tailElem?: React.ReactNode;
}

export default function SettingsLayout({ title, children, tailElem }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Stack
        horizontal
        className="relative h-screen overflow-hidden bg-gray-100 sm:pl-[288px]"
      >
        <Stack
          grow
          className={`fixed left-0 top-0 bottom-0 z-20 bg-gray-100 w-full sm:w-[288px]`}
        >
          <Stack
            className="space-x-2 p-4"
            horizontal
            verticalAlign="center"
            disableShrink
          >
            <Link href="/" passHref>
              <a>
                <IconButton iconProps={{ iconName: "ChevronLeft" }} />
              </a>
            </Link>
            <Text className="font-bold">设置</Text>
          </Stack>

          <StackItem className="overflow-y-hidden" grow>
            <Nav />
          </StackItem>
        </Stack>

        <Stack className="bg-gray-200" grow horizontalAlign="center">
          <Stack className="w-full max-w-4xl 2xl:max-w-5xl  bg-gray-50 relative h-full overflow-x-hidden">
            <div>
              <Stack
                className="px-12 pt-16 pb-4 h-14 mb-2"
                horizontal
                verticalAlign="center"
                disableShrink
              >
                <StackItem grow>
                  <Text className="font-bold">{title}</Text>
                </StackItem>
                <StackItem>{tailElem}</StackItem>
              </Stack>
              <Stack className="px-12" grow>
                {children}
              </Stack>
            </div>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
