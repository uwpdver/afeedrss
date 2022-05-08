import { NormalizedSchema, schema } from "normalizr";
import { FeedProps } from ".";

export interface InfiniteNormalizedArticles
  extends NormalizedSchema<ArticleEntitySchema, string[]> {
  continuation: string;
}

export interface ArticleEntitySchema {
  article: {
    [key: string]: any;
  };
}

export const article = new schema.Entity<FeedProps>("article");
