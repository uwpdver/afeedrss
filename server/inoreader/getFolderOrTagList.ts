import { fetch } from "../index";
import { InoreaderTag } from "../../types";

export interface InoreaderTagListResponse {
  tags: InoreaderTag[];
}

/**
 * 获取文件夹或标签列表
 * @params
 * @returns 
 */
export function getFolderOrTagList(types?: number, counts?: number) {
  return fetch.get<InoreaderTagListResponse>(`/reader/api/0/tag/list`, {
    params: {
      types: types,
      counts: counts,
    },
  });
}
