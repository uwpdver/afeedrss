import React, { useMemo, useContext } from "react";
import { useRouter } from "next/router";
import qs from "query-string";
import { Stack, Text, INavLink, Nav, IRenderFunction } from "@fluentui/react";

import SubscriptionNavTreeBuilder from "../../utils/subscriptionNavTreeBuilder";
import { GlobalNavigationCtx } from './../home/layout';
import {
  useStreamPreferencesQuery,
  useSubscriptionsListQuery,
  useFolderQuery,
} from "./utils";

export interface Props {
  userId?: string;
  className?: string;
}

const SourcesPanel = ({ className, userId }: Props) => {
  const router = useRouter();
  const { setIsOpen } = useContext(GlobalNavigationCtx);
  const streamPreferencesQuery = useStreamPreferencesQuery();
  const folderQuery = useFolderQuery();
  const subscriptionsListQuery = useSubscriptionsListQuery();

  const subscriptionsListData = subscriptionsListQuery.data;
  const folderData = folderQuery.data;
  const streamPreferencesData = streamPreferencesQuery.data;

  const groups = useMemo(() => {
    if (
      !userId ||
      !subscriptionsListData ||
      !folderData ||
      !streamPreferencesData
    ) {
      return null;
    }
    return new SubscriptionNavTreeBuilder({
      userId,
      subscriptionById: subscriptionsListData.entities.subscription,
      tagsById: folderData.entities.folder,
      streamPrefById: streamPreferencesData.streamprefs,
    }).build();
  }, [userId, subscriptionsListData, folderData, streamPreferencesData]);

  const handleLinkClick = (
    e?: React.MouseEvent<HTMLElement>,
    item?: INavLink
  ) => {
    e?.preventDefault();
    const query = qs.stringify({ ...router.query, streamId: item?.key });
    const href = `/?${query}`;
    router.push(href, href, { shallow: true });
    setIsOpen(false);
  };

  const onRenderLink: IRenderFunction<INavLink> = (props, defaultRender) => {
    if (!props) return null;

    return (
      <Stack horizontal verticalAlign="center" className="w-full mx-2">
        <Text block nowrap className="flex-1 text-left">
          {props.name}
        </Text>
        {props.type !== "feed" && props.unreadCount !== 0 ? (
          <span className="text-sm text-gray-400">{props.unreadCount}</span>
        ) : null}
      </Stack>
    );
  };

  return (
    <Stack className={`${className} min-h-0`}>
      <Nav
        styles={{
          root: "px-2",
          chevronButton: "left-auto right-4",
          link: "pl-4 pr-12",
        }}
        groups={groups}
        onRenderLink={onRenderLink}
        onLinkClick={handleLinkClick}
        onRenderGroupHeader={() => null}
      />
    </Stack>
  );
};

export default React.memo(SourcesPanel);
