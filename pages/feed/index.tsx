import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  IconButton,
  Spinner,
  Stack,
  StackItem,
  List,
  Image,
  ImageFit,
  Text,
} from "@fluentui/react";
import { Waypoint } from "react-waypoint";

import { useStreamContent } from "./../../utils/useStreamContent";
import { filterImgSrcfromHtmlStr } from "../../utils/filterImgSrcfromHtmlStr";
import { StreamContentItem } from "../../server/inoreader";

import StatusCard, { Status } from "../../components/statusCard";
import SourcesPanel from "../../components/sourcePanel";

interface Props {}

const getQueryParma = (query: string | string[] | undefined) => {
  if (Array.isArray(query)) {
    return query[0];
  } else {
    return query;
  }
};

export default function Feed({}: Props) {
  const router = useRouter();
  const articleId = getQueryParma(router.query.articleId) ?? "";
  const streamId = getQueryParma(router.query.streamId) ?? "";
  const userId = getQueryParma(router.query.userId) || "";
  const unreadOnly = !!getQueryParma(router.query.unreadOnly);

  const [curArticle, setCurArticle] = useState<StreamContentItem | null>(null);
  const [isAritleTitleShow, setIsAritleTitleShow] = useState(false);
  const streamContentQuery = useStreamContent({
    unreadOnly,
    userId,
    streamId,
  });
  const articleScrollContainerRef = useRef<HTMLDivElement>(null);

  const streamContentListItems = useMemo(() => {
    const initList: StreamContentItem[] = [];
    if (!streamContentQuery.data || !streamContentQuery.data.pages) {
      return initList;
    }
    const { pages } = streamContentQuery.data;
    const items = pages.reduce((acc, cur) => acc.concat(cur.items), initList);
    return items;
  }, [streamContentQuery.data]);

  useEffect(() => {
    if (articleScrollContainerRef.current) {
      articleScrollContainerRef.current.scrollTop = 0;
    }
  }, [curArticle?.id]);

  const onEnterWaypoint = () => {
    if (streamContentQuery.hasNextPage) {
      streamContentQuery.fetchNextPage();
    }
  };

  const onRenderCell = (
    item?: StreamContentItem,
    index?: number
  ): React.ReactNode => {
    if (!item) return null;
    const { title } = item;
    const onClickTitle = () => {
      setCurArticle(item);
    };

    return (
      <>
        <Stack
          horizontal
          data-is-focusable={true}
          tokens={{ childrenGap: 16 }}
          className="mb-3 p-3"
        >
          <StackItem shrink>
            <Image
              src={filterImgSrcfromHtmlStr(item.summary.content)}
              width={80}
              height={80}
              imageFit={ImageFit.cover}
              className="bg-gray-300 rounded-md"
              alt=""
            />
          </StackItem>
          <StackItem grow>
            <Stack>
              <Text onClick={onClickTitle} className="cursor-pointer" block>
                {title}
              </Text>
              <Stack horizontal verticalAlign="center">
                <StackItem grow>
                  <Text className="text-xs text-gray-400">
                    {item.origin.title}
                  </Text>
                </StackItem>
                <StackItem>
                  <IconButton iconProps={{ iconName: "Completed" }} />
                </StackItem>
              </Stack>
            </Stack>
          </StackItem>
        </Stack>
        {index === streamContentListItems.length - 1 ? (
          <Waypoint onEnter={onEnterWaypoint} />
        ) : null}
      </>
    );
  };

  const onRenderList = () => {
    if (streamContentQuery.isFetched) {
      if (streamContentQuery.error) {
        return <StatusCard status={Status.ERROR} content="出错了" />;
      } else if (streamContentListItems.length === 0) {
        return <StatusCard status={Status.EMPTY} content="这里是空的" />;
      }
    }
    return (
      <List
        items={streamContentListItems}
        onRenderCell={onRenderCell}
        onShouldVirtualize={() => false}
      />
    );
  };

  return (
    <div
      className="grid grid-cols-24 relative h-screen overflow-hidden bg-gray-100"
      style={{
        gridTemplateRows: `48px auto`,
      }}
    >
      <Stack
        horizontal
        verticalAlign="center"
        horizontalAlign="space-between"
        className="row-start-1 col-span-4 bg-white px-4"
      >
        <StackItem>
          <Text className="text-lg font-bold">Feeds</Text>
        </StackItem>
        <StackItem>
          <Link href="/settings" passHref>
            <a>
              <IconButton iconProps={{ iconName: "Settings" }} />
            </a>
          </Link>
        </StackItem>
      </Stack>
      <Stack
        horizontal
        verticalAlign="center"
        className="row-start-1 col-span-7 bg-gray-50 px-4"
      >
        <Text className="text-lg font-bold">未读文章</Text>
      </Stack>
      <Stack
        horizontal
        verticalAlign="center"
        className="row-start-1  col-span-13 bg-white px-4"
      >
        <StackItem>
          {isAritleTitleShow && (
            <Text
              className="text-lg font-bold block truncate cursor-pointer"
              onClick={() =>
                articleScrollContainerRef.current?.scrollTo({ top: 0 })
              }
            >
              {curArticle?.title}
            </Text>
          )}
        </StackItem>
      </Stack>
      <div className="row-start-2 col-span-4 sticky top-0 overflow-y-scroll scrollbar bg-white">
        <SourcesPanel />
      </div>
      <div
        className="row-start-2 col-span-7 overflow-y-scroll scrollbar bg-gray-50"
        data-is-scrollable="true"
      >
        {onRenderList()}
        <div className="flex justify-center w-full p-4">
          {streamContentQuery.isFetching && <Spinner />}
        </div>
      </div>
      <div className="row-start-2 col-span-13 bg-white relative">
        <div
          className="overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 w-full h-full absolute top-0 left-0"
          ref={articleScrollContainerRef}
        >
          {curArticle ? (
            <article className="prose mx-auto mt-24">
              <h1>{curArticle?.title}</h1>
              <Waypoint
                key={curArticle?.title}
                onEnter={() => setIsAritleTitleShow(false)}
                onLeave={() => setIsAritleTitleShow(true)}
              />
              <Stack horizontal verticalAlign="center">
                <StackItem grow>
                  <Text className="text-gray-400 text-sm">{`${curArticle?.origin.title}/${curArticle?.published}`}</Text>
                </StackItem>
                <StackItem>
                  <IconButton
                    iconProps={{ iconName: "OpenInNewWindow" }}
                    onClick={() => window.open(curArticle?.canonical[0].href)}
                    title="在新标签页打开"
                  />
                </StackItem>
              </Stack>
              <div
                dangerouslySetInnerHTML={{
                  __html: curArticle?.summary.content ?? "",
                }}
              />
            </article>
          ) : null}
        </div>
      </div>
    </div>
  );
}
