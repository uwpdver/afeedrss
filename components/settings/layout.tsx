import React from "react";
import { Text, Stack, StackItem, IconButton } from "@fluentui/react";
import Link from "next/link";
import Nav from "./nav";

interface Props {
  title?: string;
  children?: React.ReactNode;
}

export default function SettingsLayout({ title, children }: Props) {
  return (
    <div
      className="grid grid-cols-24 relative h-screen overflow-hidden bg-gray-100"
      style={{
        gridTemplateRows: `48px auto`,
      }}
    >
      <Stack
        className="col-span-4"
        horizontal
        verticalAlign="center"
        tokens={{ childrenGap: 8 }}
      >
        <StackItem>
          <Link href="/feed" passHref>
            <a>
              <IconButton iconProps={{ iconName: "ChevronLeft" }} />
            </a>
          </Link>
        </StackItem>
        <StackItem>
          <Text className="font-bold">设置</Text>
        </StackItem>
      </Stack>
      <div className="row-start-2 col-span-4">
        <Nav />
      </div>
      <Stack
        className="col-span-14 bg-white px-4 flex"
        horizontal
        verticalAlign="center"
      >
        <Text className="font-bold">{title}</Text>
      </Stack>
      <div className="row-start-2 col-span-14 bg-white">{children}</div>
    </div>
  );
}
