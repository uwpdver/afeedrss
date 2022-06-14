import React from "react";
import {
  Text,
  Stack,
  StackItem,
  Icon,
  List,
  Nav,
  IRenderFunction,
  INavLink,
} from "@fluentui/react";
import Link from "next/link";

import { NavListItem } from "./types";
import { NAV_LIST } from "./constants";

export default function SettingsNav() {
  const onRenderLink: IRenderFunction<INavLink> = (props, defaultRender) => {
    if (!props) {
      return null;
    }

    return (
      <Link href={props.url} passHref replace>
        <Stack horizontal verticalAlign="center" className="w-full mx-2">
          <Text block nowrap className="flex-1 text-left">
            {props.name}
          </Text>
        </Stack>
      </Link>
    );
  };

  const handleLinkClick = (
    e?: React.MouseEvent<HTMLElement>,
    item?: INavLink
  ) => {
    e?.preventDefault();
  };

  return (
    <Nav
      styles={{
        root: "px-2",
        chevronButton: "left-auto right-4",
        link: "pl-4 pr-12",
      }}
      groups={[{ links: NAV_LIST }]}
      onRenderLink={onRenderLink}
      onLinkClick={handleLinkClick}
      onRenderGroupHeader={() => null}
    />
  );
}
