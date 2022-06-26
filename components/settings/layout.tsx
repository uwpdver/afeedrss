import React, { useContext } from "react";
import { Text, Stack, StackItem, IconButton } from "@fluentui/react";
import StatusCard, { Status } from "../statusCard";
import { GlobalNavigationCtx } from "../home/layout";

interface Props {
  title?: string;
  children?: React.ReactNode;
  tailElem?: React.ReactNode;
}

export default function Layout({ title, children, tailElem }: Props) {
  const { setIsOpen } = useContext(GlobalNavigationCtx);
  return (
    <div className="px-6 sm:px-12">
      <div className="pt-4 sm:pt-16 mb-4">
        <div className="sm:hidden mb-2">
          <IconButton
            iconProps={{ iconName: "GlobalNavButton" }}
            onClick={() => setIsOpen(true)}
            className="mr-3"
          />
        </div>
        <Stack horizontal verticalAlign="center">
          <StackItem grow>
            <Text className="text-lg font-bold">{title}</Text>
          </StackItem>
          <StackItem>{tailElem}</StackItem>
        </Stack>
      </div>
      <Stack grow>
        {children ?? (
          <StatusCard status={Status.EMPTY} content="这里空无一物" />
        )}
      </Stack>
    </div>
  );
}
