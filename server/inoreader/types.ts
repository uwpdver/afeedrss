export enum TextDirection {
  ltr = "ltr",
  rtl = "rtl",
}

export interface IdValuePair {
  id: string;
  value: string;
}

export interface StreamContentItem {
  alternate: { href: string; type: string }[];
  annotations: any[];
  author: string;
  canonical: { href: string; title: string }[];
  categories: string[];
  comments: any[];
  commentsNum: number;
  crawlTimeMsec: string;
  id: string;
  likingUsers: any[];
  origin: {
    htmlUrl: string;
    streamId: string;
    title: string;
  };
  published: number;
  summary: {
    direction: TextDirection;
    content: string;
  };
  timestampUsec: string;
  title: string;
  updated: number;
  isRead?: boolean;
}

export interface StreamContentsResponse {
  items: StreamContentItem[];
  continuation: string;
  description: string;
  direction: TextDirection;
  id: string;
  self: { href: string };
  title: string;
  updated: number;
}

export enum FeedActionType {
  edit = "edit",
  subscribe = "subscribe",
  unsubscribe = "unsubscribe",
}

export enum SystemStreamIDs {
  READ = "user/-/state/com.google/read", // Read articles.
  STARRED = "user/-/state/com.google/starred", // Starred articles.
  BROADCAST = "user/-/state/com.google/broadcast", // Broadcasted articles.
  ANNOTATIONS = "user/-/state/com.google/annotations", // Annotated articles.
  LIKE = "user/-/state/com.google/like", // Likes articles.
  SAVE_WEB_PAGES = "user/-/state/com.google/saved-web-pages", // Saved web pages.
}

export interface MarkArticleParmas {
  i: string | string[];
  a?: SystemStreamIDs;
  r?: SystemStreamIDs;
}
