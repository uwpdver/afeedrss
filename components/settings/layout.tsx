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
      <div className="flex items-center col-span-4 space-x-4">
        <Link href="/feed" passHref>
          <a>
            <IconButton iconProps={{ iconName: "ChevronLeft" }} />
          </a>
        </Link>
        <Text className="font-bold">设置</Text>
      </div>
      <div className="row-start-2 col-span-4">
        <Nav />
      </div>
      <div className="flex items-center col-span-14 bg-white px-4">
        <Text className="font-bold">{title}</Text>
      </div>
      <div className="row-start-2 col-span-14 bg-white">{children}</div>
    </div>
  );
}
