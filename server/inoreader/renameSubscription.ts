import { fetch } from "../index";
import { FeedActionType } from "./types";

/**
 * 重命名订阅源
 * @params
 * @returns 
 */
export function renameSubscription(streamId: string, title: string) {
  return fetch.get(`/reader/api/0/subscription/edit`, {
    params: {
      ac: FeedActionType.edit,
      s: streamId,
      t: title,
    },
  });
}
