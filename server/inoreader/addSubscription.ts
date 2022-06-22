import { fetch } from "../index";
import { FeedActionType } from "./types";

/**
 * 添加订阅源
 * @params
 * @returns
 */
export function addSubscription(url: string, folder?: string) {
  return fetch.get(`/reader/api/0/subscription/edit`, {
    params: {
      ac: FeedActionType.subscribe,
      s: url,
      a: folder || "",
    },
  });
}
