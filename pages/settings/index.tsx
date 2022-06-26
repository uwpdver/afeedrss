import React from "react";
import Link from "next/link";
import { Icon, Stack, StackItem, Text } from "@fluentui/react";
import SettingsLayout from "../../components/settings/layout";
import { NAV_LIST } from "../../components/settings/constants";
import { NavListItem } from "./../../components/settings/types";

interface Props {}

export default function Settings({}: Props) {
  const onRenderNavItem = ({ iconProps, name, url, desc }: NavListItem) => (
    <Link href={url}>
      <a>
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 16}}>
        <StackItem disableShrink>
          <Icon className="text-lg" {...iconProps} />
        </StackItem>
        <Stack grow>
          <Text className="text-black">{name}</Text>
          <Text className="text-black text-opacity-50 text-sm">{desc}</Text>
        </Stack>
        <StackItem disableShrink>
          <Icon iconName="ChevronRight" />
        </StackItem>
      </Stack>
      </a>
    </Link>
  );

  return (
    <SettingsLayout title="设置">
      <ul className=" space-y-4">
        {NAV_LIST.map((item) => (
          <li key={item.key}>{onRenderNavItem(item)}</li>
        ))}
      </ul>
    </SettingsLayout>
  );
}
