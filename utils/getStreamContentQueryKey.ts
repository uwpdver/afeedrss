import { QUERY_KEYS } from "../constants";
import { getRootStreamId } from "./getRootSteamId";

export interface StreamContentQueryKeyParmas {
  unreadOnly: boolean;
  userId: string;
  streamId?: string;
}

export function getStreamContentQueryKey({
  unreadOnly,
  userId,
  streamId,
}: StreamContentQueryKeyParmas): any[] {
  return [
    QUERY_KEYS.STREAM_CONTENT,
    streamId || getRootStreamId(userId),
    unreadOnly,
  ];
}
