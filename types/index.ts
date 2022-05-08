import { Dayjs } from "dayjs";
export interface FeedItem {
  id: string;
  title: string;
  summary?: string;
  thumbnailSrc?: string;
  content?: string;
  url?: string;
  sourceName?: string;
  sourceID?: string;
  publishedTime: Dayjs;
  isRead?: boolean;
  isStar?: boolean;
  isInnerArticleShow?: boolean;
}


export interface Tag extends Sortable {
  id: string;
  type?: string;
  unread_count?: number;
  unseen_count?: number;
}

export interface FeedGroup {
  id: string;
  name: string;
  children: any[];
}

export interface FeedProps extends FeedItem {
  className?: string;
  rootClassName?: string;
  itemClassName?: string;
}

export interface KeyValuePair<T> {
  [key: string]: T;
}
export interface Sortable {
  sortid: string;
}

export interface Subscription extends Sortable {
  id: string;
  title: string;
  iconUrl?: string;
  iconName?: string;
}

export interface InoreaderTag extends Sortable {
  id: string;
  type?: "tag" | "folder" | "active_search";
  unread_count?: number;
  unseen_count?: number;
}

export interface SubscriptionEntity {
  subscription: { [key: string]: Subscription };
}

export interface Folder extends InoreaderTag {
  isCollapsed?: boolean;
}

export interface FolderEntity {
  folder: { [key: string]: Folder };
}
