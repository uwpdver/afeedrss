import React from "react";
import { Text, Stack, StackItem } from "@fluentui/react";
import HomeLayout from "../home/layout";
import StatusCard, { Status } from "../statusCard";

interface Props {
  title?: string;
  children?: React.ReactNode;
  tailElem?: React.ReactNode;
}

export default React.memo(function SettingsLayout({
  title,
  children,
  tailElem,
}: Props) {
  return (
    <HomeLayout title={title}>
      <div className="px-6 sm:px-12">
        <Stack
          className="pt-16 pb-4 h-14 mb-2"
          horizontal
          verticalAlign="center"
          disableShrink
        >
          <StackItem grow>
            <Text className="text-lg font-bold">{title}</Text>
          </StackItem>
          <StackItem>{tailElem}</StackItem>
        </Stack>
        <Stack grow>
          {children ?? (
            <StatusCard status={Status.EMPTY} content="这里空无一物" />
          )}
        </Stack>
      </div>
    </HomeLayout>
  );
});
