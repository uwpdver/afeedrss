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
    "feed/streamContentQuery",
    streamId || getRootStreamId(userId),
    unreadOnly,
  ];
}
