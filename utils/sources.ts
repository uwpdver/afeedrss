import { INavLink, INavLinkGroup } from "@fluentui/react";
import { IdValuePair } from "../server/inoreader";
import { Subscription, Folder, Sortable, KeyValuePair, Tag } from "../types";

export const getTagNameFromId = (tagId: string): string => {
  const slice: string[] = tagId.split("/");
  return slice[slice.length - 1];
};

const getIdBySortidCurry = ({
  subscriptionById,
  tagsById,
}: {
  subscriptionById: {
    [key: string]: Subscription;
  };
  tagsById: {
    [key: string]: Folder;
  };
}) => {
  const createIdTableIndexedBySortid = (tagsById: {
    [id: string]: Sortable;
  }): { [sortId: string]: string } => {
    let result: { [sortId: string]: string } = {};
    for (const id in tagsById) {
      if (Object.prototype.hasOwnProperty.call(tagsById, id)) {
        const tag = tagsById[id];
        result[tag.sortid] = id;
      }
    }
    return result;
  };

  const subscriptionIdTableIndexBySortid =
    createIdTableIndexedBySortid(subscriptionById);

  const tagIdTableIndexBySortid = createIdTableIndexedBySortid(tagsById);

  const sortidToIdMap = {
    ...subscriptionIdTableIndexBySortid,
    ...tagIdTableIndexBySortid,
  };

  return (sortid: string) => sortidToIdMap[sortid];
};

const getLinks = (streamPref: IdValuePair[]): any[] => {
  const getSortIdString = (streamPref: IdValuePair[]): string => {
    return streamPref[streamPref.length - 1]?.value;
  };

  const chunck = (str: string): string[] => {
    return str.match(/.{1,8}/g) || [];
  };

  const sortIdString = getSortIdString(streamPref);
  return chunck(sortIdString);
};

const createLink = (subscription: Subscription): INavLink => {
  return {
    name: subscription.title,
    key: subscription.id,
    url: "",
    type: "feed",
    iconUrl: subscription.iconUrl,
  };
};

const createTagLink = (tag: Tag): INavLink => {
  return {
    name: getTagNameFromId(tag.id),
    key: tag.id,
    url: "",
    type: "tag",
    iconName: "Tag",
    unreadCount: tag.unread_count,
  };
};

const createFolderLink = (
  tag: Tag,
  links: INavLink[],
  id?: string
): INavLink => {
  if (!tag && id) {
    const name = getTagNameFromId(id);
    return {
      name,
      links: links,
      key: id,
      url: "",
      type: "folder",
      iconName: "FolderHorizontal",
    };
  } else {
    const name = getTagNameFromId(tag.id);
    return {
      name: name,
      links: links,
      key: tag.id,
      url: "",
      type: "folder",
      iconName: "FolderHorizontal",
      unreadCount: tag?.unread_count,
    };
  }
};

export const getNavLinkGroupProps = (
  rootStreamId: string,
  {
    subscriptionById,
    tagsById,
    streamPrefById,
  }: {
    subscriptionById: KeyValuePair<Subscription>;
    tagsById: KeyValuePair<Folder>;
    streamPrefById: KeyValuePair<IdValuePair[]>;
  }
): INavLinkGroup | null => {
  if (!subscriptionById || !tagsById || !streamPrefById) {
    return null;
  }

  const getIdBySortid = getIdBySortidCurry({
    subscriptionById,
    tagsById,
  });

  const _getNavLinkGroupProps = (id: string): any => {
    const isFeedId = (id: string): boolean => {
      return !!id && id.startsWith("feed/");
    };

    if (isFeedId(id)) {
      const subscription = subscriptionById[id];
      return createLink(subscription);
    } else {
      const tag = tagsById[id];
      if (tag && tag.type === "tag") {
        return createTagLink(tag);
      } else {
        const links = getLinks(streamPrefById[id])
          .map(getIdBySortid)
          .map(_getNavLinkGroupProps);
        return createFolderLink(tag, links, id);
      }
    }
  };

  return _getNavLinkGroupProps(rootStreamId);
};

export const createBuildInNavLink = ({
  name,
  id,
  iconName,
}: {
  name: string;
  id: string;
  iconName: string;
}): INavLink => {
  return {
    name,
    key: id,
    url: "",
    type: "buildIn",
    iconName,
  };
};
