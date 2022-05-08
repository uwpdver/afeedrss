import React from "react";
import {
  IconButton,
  Stack,
  StackItem,
  List,
  Image,
  ImageFit,
  mergeStyleSets,
  Text,
} from "@fluentui/react";
import { GetServerSideProps } from "next";
import { useStreamContent } from "./../../utils/useStreamContent";
import {
  StreamContentQueryKeyParmas,
  getStreamContentQueryKey,
} from "../../utils/getStreamContentQueryKey";
import { StreamContentItem } from "../../server/inoreader";
import SourcesPanel from "./sourcesPanel";
import { filterImgSrcfromHtmlStr } from "../../utils/filterImgSrcfromHtmlStr";

interface Props extends StreamContentQueryKeyParmas {}

export default function Feed({ streamId, userId, unreadOnly }: Props) {
  const streamContentQuery = useStreamContent({
    unreadOnly,
    userId,
    streamId,
  });

  const onRenderCell = (item?: StreamContentItem): React.ReactNode => {
    if (!item) return null;
    const { title } = item;
    return (
      <Stack
        horizontal
        data-is-focusable={true}
        tokens={{ childrenGap: 16 }}
        className="mb-3 mx-4 p-3 bg-white rounded-lg shadow-sm"
      >
        <StackItem shrink>
          <Image
            src={filterImgSrcfromHtmlStr(item.summary.content)}
            width={100}
            height={100}
            imageFit={ImageFit.cover}
            className="bg-gray-300 rounded-md"
            alt=""
          />
        </StackItem>
        <StackItem grow>
          <Text>{title}</Text>
        </StackItem>
      </Stack>
    );
  };

  const getStreamContentListItems = () => {
    const initList: StreamContentItem[] = [];
    if (!streamContentQuery.data || !streamContentQuery.data.pages) {
      return initList;
    }
    const { pages } = streamContentQuery.data;
    const items = pages.reduce((acc, cur) => acc.concat(cur.items), initList);
    return items;
  };

  return (
    <Stack horizontal>
      <StackItem shrink={false}>
        <nav className="">
          <Stack>
            <IconButton iconProps={{ iconName: "GlobalNavButton" }} />
            <IconButton iconProps={{ iconName: "Home" }} />
            <IconButton iconProps={{ iconName: "Settings" }} />
          </Stack>
        </nav>
      </StackItem>
      <main className="relative grid grid-cols-24 h-screen overflow-hidden bg-gray-100">
        <div className="col-span-4 sticky top-0 overflow-y-scroll scrollbar bg-white">
          <SourcesPanel />
        </div>
        <div className="col-span-7 overflow-y-scroll scrollbar"  data-is-scrollable="true">
          <List
            items={getStreamContentListItems()}
            onRenderCell={onRenderCell}
          />
        </div>
        <div className="col-span-13 overflow-y-scroll scrollbar bg-white"></div>
      </main>
    </Stack>
  );
}

const getQueryParma = (query: string | string[] | undefined) => {
  if (Array.isArray(query)) {
    return query[0];
  } else {
    return query;
  }
};

export const getServerSideProps: GetServerSideProps<
  any,
  {
    streamId: string;
    userId: string;
    unreadOnly: string;
  },
  any
> = async (context) => {
  const articleId = getQueryParma(context.query.articleId) ?? "";
  const streamId = getQueryParma(context.query.streamId) ?? "";
  const userId = getQueryParma(context.query.userId) || "1006201176";
  const unreadOnly = !!getQueryParma(context.query.unreadOnly);
  const streamContentQueryKey = getStreamContentQueryKey({
    streamId,
    userId,
    unreadOnly,
  });
  return {
    props: {
      streamContentQueryKey,
      articleId,
      streamId,
      userId,
      unreadOnly,
    },
  };
};
