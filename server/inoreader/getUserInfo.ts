import { fetch } from "../index";

export interface UserInfoResponse {
  userId: string;
  userName: string;
  userProfileId: string;
  userEmail: string;
  isBloggerUser: boolean;
  signupTimeSec: number;
  isMultiLoginEnabled: boolean;
}

/**
 * 获取用户信息
 * @returns
 */
export function getUserInfo() {
  return fetch.get<UserInfoResponse>(`/reader/api/0/user-info`);
}
