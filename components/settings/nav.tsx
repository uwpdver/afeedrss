import React from "react";
import { Text, Stack, StackItem, Icon, List } from "@fluentui/react";
import Link from "next/link";

import { NavListItem } from "./types";
import { NAV_LIST } from "./constants";

export default function SettingsNav() {
  const onRenderNavCell = (item?: NavListItem) => {
    return (
      <Link href={item?.pathname ?? ""} passHref={true}>
        <a>
          <Stack
            horizontal
            verticalAlign="center"
            tokens={{ childrenGap: 8 }}
            className="px-4 h-8 mb-2"
          >
            <StackItem shrink>
              <Icon {...item?.iconProps} />
            </StackItem>
            <StackItem grow>
              <Text>{item?.name}</Text>
            </StackItem>
          </Stack>
        </a>
      </Link>
    );
  };

  return <List items={NAV_LIST} onRenderCell={onRenderNavCell} />;
}
