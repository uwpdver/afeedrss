import { fetch } from "../index";
import { FeedActionType } from "./types";

/**
 * 退订订阅源
 * @params
 * @returns 
 */
export function unsubscription(streamId: string) {
  return fetch.get(`/reader/api/0/subscription/edit`, {
    params: {
      ac: FeedActionType.unsubscribe,
      s: streamId,
    },
  });
}
