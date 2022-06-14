import React, { useMemo } from "react";
import { Stack, Text, INavLink, Nav, IRenderFunction } from "@fluentui/react";
import { useRouter } from "next/router";
import qs from "query-string";
import { FolderEntity, InoreaderTag } from "../../types";
import { StreamPreferenceListResponse } from "../../server/inoreader";
import server from "../../server";
import { useQuery } from "react-query";
import SubscriptionNavTreeBuilder from "../../utils/subscriptionNavTreeBuilder";
import { normalize, NormalizedSchema, schema } from "normalizr";
import { Subscription, SubscriptionEntity } from "../../types";

const folder = new schema.Entity("folder");
const subscription = new schema.Entity("subscription", undefined);

export interface Props {
  userId?: string;
  className?: string;
}

const SourcesPanel = ({ className, userId }: Props) => {
  const router = useRouter();

  const onRenderLink: IRenderFunction<INavLink> = (props, defaultRender) => {
    if (!props) {
      return null;
    }

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

  const streamPreferencesQuery = useQuery<StreamPreferenceListResponse>(
    "streamPreferences",
    async () => {
      const res = await server.inoreader.getStreamPreferenceList();
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const folderQuery = useQuery<NormalizedSchema<FolderEntity, string[]>>(
    "home/folderQuery",
    async () => {
      const res = await server.inoreader.getFolderOrTagList(1, 1);
      const tags = res.data.tags;
      const foldersNormalized = normalize<InoreaderTag, FolderEntity>(tags, [
        folder,
      ]);
      return foldersNormalized;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const subscriptionsListQuery = useQuery(
    "home/subscriptionsListQuery",
    async () => {
      const subscriptionList = await server.inoreader.getSubscriptionList();
      const subscriptions = subscriptionList.data.subscriptions;
      const subscriptionsNormalized = normalize<
        Subscription,
        SubscriptionEntity
      >(subscriptions, [subscription]);
      return subscriptionsNormalized;
    },
    {
      refetchOnWindowFocus: false,
    }
  );
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
    router.push(`/?${query}`);
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
