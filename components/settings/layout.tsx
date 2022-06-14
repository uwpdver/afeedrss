import React from "react";
import { Text, Stack, StackItem, IconButton } from "@fluentui/react";
import Link from "next/link";
import Nav from "./nav";
import { LAYOUT } from "../../constants";

interface Props {
  title?: string;
  children?: React.ReactNode;
}

export default function SettingsLayout({ title, children }: Props) {
  return (
    <Stack className="relative h-screen overflow-hidden bg-gray-100" horizontal>
      <Stack tokens={{ maxWidth: LAYOUT.NAVIGATION_WIDTH }} grow >
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
        <Stack className="w-full max-w-3xl bg-gray-50 relative h-full overflow-x-hidden">
          <div>
            <Stack
              className="px-12 pt-16 pb-4"
              horizontal
              verticalAlign="center"
              disableShrink
            >
              <Text className="font-bold">{title}</Text>
            </Stack>
            <Stack className="px-12" grow>
              {children}
            </Stack>
          </div>
        </Stack>
      </Stack>
    </Stack>
  );
}
