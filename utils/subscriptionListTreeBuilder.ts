import { IdValuePair } from "../server/inoreader";
import { KeyValuePair, Subscription, Folder } from "../types";
import SubscriptionNavTreeBuilder, {
  getTagNameFromId,
} from "./subscriptionNavTreeBuilder";

export default class SubscriptionGroupedListBuilder extends SubscriptionNavTreeBuilder {
  constructor({
    userId,
    subscriptionById,
    tagsById,
    streamPrefById,
  }: {
    userId: string;
    subscriptionById: KeyValuePair<Subscription>;
    tagsById: KeyValuePair<Folder>;
    streamPrefById: KeyValuePair<IdValuePair[]>;
  }) {
    super({
      userId,
      subscriptionById,
      tagsById,
      streamPrefById,
    });
  }

  buildGroupedList() {
    const rootSortArr = this.getSortArr(this.rootId);
    const items = [];
    const groups = [];
    for (const sortId of rootSortArr) {
      const id = this.getIdBySortId(sortId);
      if (SubscriptionNavTreeBuilder.isSubscriptonId(id)) {
        const subscrption = this.getSubscription(id);
        items.push(subscrption);
      } else {
        const tag = this.getTag(id);
        if (tag.type === "tag") {
          // 如何处理 tag
        } else if (tag.type === "folder") {
          const folderSortArr = this.getSortArr(id);
          const name = getTagNameFromId(tag.id);
          groups.push({
            key: tag.id,
            name: name,
            startIndex: items.length,
            count: folderSortArr.length,
          });
          for (const sortId of folderSortArr) {
            const id = this.getIdBySortId(sortId);
            const subscrption = this.getSubscription(id);
            items.push(subscrption);
          }
        }
      }
    }
    return {
      items,
      groups,
    };
  }
}
