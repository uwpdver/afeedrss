import qs from "query-string";
import { fetch } from "./index";
import { InoreaderTag } from "../types";

export enum TextDirection {
  ltr = "ltr",
  rtl = "rtl",
}

export enum FeedActionType {
  edit = "edit",
  subscribe = "subscribe",
  unsubscribe = "unsubscribe",
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

export interface StreamContentItemWithPageIndex extends StreamContentItem {
  pageIndex: number;
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

export interface IdValuePair {
  id: string;
  value: string;
}

export interface StreamPreferenceListResponse {
  streamprefs: {
    [key: string]: IdValuePair[];
  };
}
export interface InoreaderTagListResponse {
  tags: InoreaderTag[];
}

export enum SystemStreamIDs {
  READ = "user/-/state/com.google/read", // Read articles.
  STARRED = "user/-/state/com.google/starred", // Starred articles.
  BROADCAST = "user/-/state/com.google/broadcast", // Broadcasted articles.
  ANNOTATIONS = "user/-/state/com.google/annotations", // Annotated articles.
  LIKE = "user/-/state/com.google/like", // Likes articles.
  SAVE_WEB_PAGES = "user/-/state/com.google/saved-web-pages", // Saved web pages.
}

interface MarkAritleParmas {
  i: string | string[];
  a?: SystemStreamIDs;
  r?: SystemStreamIDs;
}

export const inoreader = {
  // Subscription list
  getSubscriptionList: () => fetch.get(`/reader/api/0/subscription/list`),
  // Stream contents
  getStreamContents: (
    streamId: string,
    {
      number,
      order,
      startTime,
      exclude,
      include,
      continuation,
    }: any | undefined
  ) =>
    fetch.get<StreamContentsResponse>(
      `/reader/api/0/stream/contents/${encodeURIComponent(streamId)}`,
      {
        params: {
          n: 20, // Number of items to return (default 20, max 1000).
          r: "", // Order. By default, it is newest first. You can pass o here to get oldest first.
          ot: "", // Start time (unix timestamp) from which to start to get items. If r=o and the time is older than one month ago, one month ago will be used instead.
          xt: exclude, // Exclude Target - You can query all items from a feed that are not flagged as read by setting this to user/-/state/com.google/read.
          it: "", // include Target - You can query for a certain label with this. Accepted values: user/-/state/com.google/starred, user/-/state/com.google/like.
          c: continuation, // Continuation - a string used for continuation process. Each response returns not all, but only a certain number of items. You'll find in the JSON response a string called continuation. Just add that string as argument for this parameter, and you'll retrieve next items. If the continuation string is missing, then you are at the end of the stream.
          output: "", // if you prefer JSON object pass json here. Note that reader/api/0/stream/contents always returns json object, while reader/atom returns XML by default.
          includeAllDirectStreamIds: "", // set this to false if you want to receive only manually added tags in the categories list. Otherwise automatically added tags from the folders will be populated there too.
          annotations: "", // set this to 1 or true if you want to get an array of your annotations for each article.
        },
      }
    ),
  // User information
  getUserInfo: () => fetch.get(`/reader/api/0/user-info`),
  getStreamPreferenceList: () =>
    fetch.get<StreamPreferenceListResponse>(
      `/reader/api/0/preference/stream/list`
    ),
  // add subscription
  addSubscription: (url: string, folder?: string) =>
    fetch.get(`/reader/api/0/subscription/edit`, {
      params: {
        ac: "subscribe",
        s: url,
        a: folder || "",
      },
    }),
  // unsubscription
  unsubscription: (streamId: string) =>
    fetch.get(`/reader/api/0/subscription/edit`, {
      params: {
        ac: FeedActionType.unsubscribe,
        s: streamId,
      },
    }),
  renameFeed: (streamId: string, title: string) =>
    fetch.get(`/reader/api/0/subscription/edit`, {
      params: {
        ac: FeedActionType.edit,
        s: streamId,
        t: title,
      },
    }),
  // Folder/Tag list
  getFolderOrTagList: (types?: number, counts?: number) =>
    fetch.get<InoreaderTagListResponse>(`/reader/api/0/tag/list`, {
      params: {
        types: types,
        counts: counts,
      },
    }),
  markArticleAsRead: (id: string | string[], asUnread?: boolean) => {
    const params: MarkAritleParmas = { i: id };
    if (asUnread) {
      params["r"] = SystemStreamIDs.READ;
    } else {
      params["a"] = SystemStreamIDs.READ;
    }
    return fetch.post(`/reader/api/0/edit-tag`, null, {
      params: params,
      paramsSerializer: (params) => {
        const result = qs.stringify(params);
        return result;
      },
    });
  },
  markAllAsRead: (streamId: string) => {
    return fetch.post(`/reader/api/0/mark-all-as-read`, null, {
      params: {
        ts: Date.now(),
        s: streamId,
      },
    });
  },
  markArticleAsStar: (id: string, isStar?: boolean) => {
    const params: MarkAritleParmas = { i: id };
    if (isStar) {
      params["a"] = SystemStreamIDs.STARRED;
    } else {
      params["r"] = SystemStreamIDs.STARRED;
    }
    return fetch.post(`/reader/api/0/edit-tag`, null, {
      params: params,
    });
  },
};
