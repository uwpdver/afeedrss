import { INavLink, INavLinkGroup } from "@fluentui/react";
import { IdValuePair, SystemStreamIDs } from "../../server/inoreader";
import { Subscription, Folder, KeyValuePair, Tag } from "../../types";
import { getRootStreamId } from "../../utils/getRootSteamId";

export const getTagNameFromId = (tagId: string): string => {
  const slice: string[] = tagId.split("/");
  return slice[slice.length - 1];
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

export default class SubscriptionNavTreeBuilder {
  private rootId: string = "";
  private subscriptionById: KeyValuePair<Subscription> = {};
  private tagsById: KeyValuePair<Folder> = {};
  private streamPrefById: KeyValuePair<IdValuePair[]> = {};
  private sortIdToId: KeyValuePair<string> = {};

  constructor({
    userId,
    subscriptionById,
    tagsById,
    streamPrefById,
  }: {
    userId: string;
    subscriptionById: KeyValuePair<Subscription>;
    tagsById: KeyValuePair<Folder>;
    streamPrefById: KeyValuePair<IdValuePair[]>;
  }) {
    this.rootId = getRootStreamId(userId);
    this.subscriptionById = subscriptionById;
    this.tagsById = tagsById;
    this.streamPrefById = streamPrefById;
    for (const key in subscriptionById) {
      if (Object.prototype.hasOwnProperty.call(subscriptionById, key)) {
        const element = subscriptionById[key];
        this.sortIdToId[element.sortid] = key;
      }
    }
    for (const key in tagsById) {
      if (Object.prototype.hasOwnProperty.call(tagsById, key)) {
        const element = tagsById[key];
        this.sortIdToId[element.sortid] = key;
      }
    }
  }

  static chunck(str: string): string[] {
    return str.match(/.{1,8}/g) || [];
  }

  static getSort(streamPref: IdValuePair[]): string {
    return !streamPref || streamPref.length < 1
      ? ""
      : streamPref[streamPref.length - 1].value;
  }

  static isSubscriptonId(id: string): boolean {
    return !!id && id.startsWith("feed/");
  }

  build(): INavLinkGroup[] {
    const sortArr = this.getSortArr(this.rootId);
    const links = this.buildCore(sortArr);
    links.unshift(
      createBuildInNavLink({
        id: this.rootId,
        name: "all article",
        iconName: "PreviewLink",
      }),
      createBuildInNavLink({
        id: SystemStreamIDs.STARRED,
        name: "stared article",
        iconName: "FavoriteStar",
      })
    );
    return [
      {
        links,
      },
    ];
  }

  getIdBySortId(sortId: string) {
    return this.sortIdToId[sortId];
  }

  getStreamPref(id: string) {
    return this.streamPrefById[id];
  }

  getTag(id: string) {
    return this.tagsById[id];
  }

  getSubscription(id: string) {
    return this.subscriptionById[id];
  }

  getSortArr(id: string): string[] {
    const streamPref = this.getStreamPref(id);
    if (streamPref) {
      const sort = SubscriptionNavTreeBuilder.getSort(streamPref);
      return SubscriptionNavTreeBuilder.chunck(sort);
    }
    return [];
  }

  private buildCore(sortArr: string[]): INavLink[] {
    const result: INavLink[] = [];
    for (const sortId of sortArr) {
      const id = this.getIdBySortId(sortId);
      let link = null;
      if (SubscriptionNavTreeBuilder.isSubscriptonId(id)) {
        const subscrption = this.getSubscription(id);
        link = createLink(subscrption);
      } else {
        const tag = this.getTag(id);
        if (tag.type === "tag") {
          link = createTagLink(tag);
        } else if (tag.type === "folder") {
          const _sortArr = this.getSortArr(id);
          const links = this.buildCore(_sortArr);
          link = createFolderLink(tag, links, id);
        }
      }
      if (link) {
        result.push(link);
      }
    }
    return result;
  }
}
