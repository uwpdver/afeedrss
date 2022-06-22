import { fetch } from "../index";
import { IdValuePair } from "./types";

export interface StreamPreferenceListResponse {
  streamprefs: {
    [key: string]: IdValuePair[];
  };
}

/**
 * 获取文章流偏好列表
 * @returns
 */
export function getStreamPreferenceList() {
  return fetch.get<StreamPreferenceListResponse>(
    `/reader/api/0/preference/stream/list`
  );
}
