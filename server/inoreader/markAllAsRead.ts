import { fetch } from "../index";

/**
 * 添加/移除某个源下的所有文章的已读标记
 * @params
 * @returns 
 */
export function markAllAsRead(streamId: string){
  return fetch.post(`/reader/api/0/mark-all-as-read`, null, {
    params: {
      ts: Date.now(),
      s: streamId,
    },
  });
}
