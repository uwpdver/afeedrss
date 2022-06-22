import { fetch } from "../index";

/**
 * 获取订阅列表
 * @returns 
 */
export function getSubscriptionList() {
  return fetch.get(`/reader/api/0/subscription/list`);
}
