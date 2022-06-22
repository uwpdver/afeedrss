import { normalize, schema } from "normalizr";
import { useQuery } from "react-query";
import { QUERY_KEYS } from "../../constants";
import server from "../../server";
import {
  Subscription,
  SubscriptionEntity,
  FolderEntity,
  InoreaderTag,
} from "../../types";

export const subscriptionSchema = new schema.Entity("subscription", undefined);

export function useSubscriptionsListQuery() {
  return useQuery(QUERY_KEYS.SUBSCRIPTIONS_LIST, async () => {
    const subscriptionList = await server.inoreader.getSubscriptionList();
    const subscriptions = subscriptionList.data.subscriptions;
    const subscriptionsNormalized = normalize<
      Subscription,
      SubscriptionEntity,
      string[]
    >(subscriptions, [subscriptionSchema]);
    return subscriptionsNormalized;
  });
}

export function useStreamPreferencesQuery() {
  return useQuery(QUERY_KEYS.STREAM_PREFERENCES, async () => {
    const res = await server.inoreader.getStreamPreferenceList();
    return res.data;
  });
}

const folder = new schema.Entity("folder");

export function useFolderQuery() {
  return useQuery(QUERY_KEYS.FOLDER, async () => {
    const res = await server.inoreader.getFolderOrTagList(1, 1);
    const tags = res.data.tags;
    const foldersNormalized = normalize<InoreaderTag, FolderEntity, string[]>(
      tags,
      [folder]
    );
    return foldersNormalized;
  });
}
