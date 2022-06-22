import { fetch } from "../index";
import { MarkArticleParmas, SystemStreamIDs } from "./types";

/**
 * 添加/移除文章的收藏标记
 * @params
 * @returns 
 */
export function markArticleAsStar(id: string, isStar?: boolean){
  const params: MarkArticleParmas = { i: id };
  params[isStar ? "r" : "a"] = SystemStreamIDs.STARRED;
  return fetch.post(`/reader/api/0/edit-tag`, null, {
    params: params,
  });
}
