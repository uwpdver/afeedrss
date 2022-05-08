import React, { ReactElement } from "react";
import {
  Stack,
  Text,
  INavLink,
  Nav,
  IRenderFunction,
  Icon,
} from "@fluentui/react";
import { get } from "lodash";
import { FolderEntity, InoreaderTag } from "../../types";
import {
  SystemStreamIDs,
  StreamPreferenceListResponse,
} from "../../server/inoreader";
import server from "../../server";
import { useQuery, useQueryClient } from "react-query";
import {
  getNavLinkGroupProps,
  createBuildInNavLink,
} from "../../utils/sources";
import { normalize, NormalizedSchema, schema } from "normalizr";
import Image from "next/image";
import { Subscription, SubscriptionEntity } from "../../types";

const folder = new schema.Entity("folder");
const subscription = new schema.Entity("subscription", undefined);

export interface Props {
  className?: string;
}

const SourcesPanel = ({ className }: Props) => {
  const isIconDisplay = true;

  const userId = "1006201176";

  const onRenderLink: IRenderFunction<INavLink> = (props, defaultRender) => {
    if (!props) {
      return null;
    }

    const iconRender = (): ReactElement | null => {
      if (props.type === "feed") {
        if (isIconDisplay && props.iconUrl) {
          return (
            <div className="mr-2 w-6 text-center">
              <div className="w-4 h-4 mx-auto relative">
                <Image src={props.iconUrl} alt="" layout="fill" />
              </div>
            </div>
          );
        } else {
          return (
            <Icon
              iconName={props.iconName}
              className="mr-2 w-6 h-6 leading-6"
            />
          );
        }
      }

      return (
        <Icon iconName={props.iconName} className="mr-2 w-6 h-6 leading-6" />
      );
    };

    return (
      <Stack horizontal verticalAlign="center" className="w-full">
        {iconRender()}
        <Text block nowrap className="flex-1 text-left">
          {props.name}
        </Text>
        {props.type !== "feed" && props.unreadCount !== 0 ? (
          <span>{props.unreadCount}</span>
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
  if (!subscriptionsListData || !folderData || !streamPreferencesData) {
    return null;
  }

  const handleLinkClick = (
    e?: React.MouseEvent<HTMLElement>,
    item?: INavLink
  ) => {
    e?.preventDefault();
  };

  const allArticleStreamId = `user/${userId}/state/com.google/root`;

  let group = getNavLinkGroupProps(allArticleStreamId, {
    subscriptionById: subscriptionsListData.entities.subscription,
    tagsById: folderData.entities.folder,
    streamPrefById: streamPreferencesData.streamprefs,
  });

  if (group) {
    const allLink = createBuildInNavLink({
      id: allArticleStreamId,
      name: "all article",
      iconName: "PreviewLink",
    });

    const favLink = createBuildInNavLink({
      id: SystemStreamIDs.STARRED,
      name: "stared article",
      iconName: "FavoriteStar",
    });

    group.links.unshift(allLink, favLink);
  }

  return (
    <Stack className={`${className} min-h-0`}>
      <Nav
        styles={{
          chevronButton: "",
          link: "pl-8 pr-6",
          compositeLink: "",
        }}
        groups={group ? [group] : null}
        onRenderLink={onRenderLink}
        onLinkClick={handleLinkClick}
        onRenderGroupHeader={() => null}
      />
    </Stack>
  );
};

export default SourcesPanel;
