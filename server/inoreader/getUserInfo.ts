import { fetch } from "../index";

/**
 * 获取用户信息
 * @returns 
 */
export function getUserInfo() {
  return fetch.get(`/reader/api/0/user-info`);
}
