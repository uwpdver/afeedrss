import { normalize, schema } from "normalizr";
import { useQuery } from "react-query";
import { QUERY_KEYS } from "../../constants";
import server from "../../server";
import { Subscription, SubscriptionEntity } from "../../types";

export const subscriptionSchema = new schema.Entity("subscription", undefined);

export function useSubscriptionsListQuery() {
  return useQuery(
    QUERY_KEYS.SUBSCRIPTIONS_LIST,
    async () => {
      const subscriptionList = await server.inoreader.getSubscriptionList();
      const subscriptions = subscriptionList.data.subscriptions;
      const subscriptionsNormalized = normalize<
        Subscription,
        SubscriptionEntity,
        string[]
      >(subscriptions, [subscriptionSchema]);
      return subscriptionsNormalized;
    },
    {
      refetchOnWindowFocus: false,
    }
  );
}
