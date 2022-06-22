import { fetch } from "../index";
import { Subscription } from "./../../types";

export interface SubscriptionListResponse {
  subscriptions: Subscription[];
}

/**
 * 获取订阅列表
 * @returns
 */
export function getSubscriptionList() {
  return fetch.get<SubscriptionListResponse>(`/reader/api/0/subscription/list`);
}
