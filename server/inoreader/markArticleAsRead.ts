import qs from "query-string";
import { fetch } from "../index";
import { MarkArticleParmas, SystemStreamIDs } from "./types";

/**
 * 添加/移除文章的已读标记
 * @params
 * @returns 
 */
export function markArticleAsRead(id: string | string[], asUnread?: boolean){
  const params: MarkArticleParmas = { i: id };
  params[asUnread ? "r" : "a"] = SystemStreamIDs.READ;
  return fetch.post(`/reader/api/0/edit-tag`, null, {
    params: params,
    paramsSerializer: (params) => {
      const result = qs.stringify(params);
      return result;
    },
  });
}
