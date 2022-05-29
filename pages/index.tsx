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
  DefaultButton,
  IList,
} from "@fluentui/react";
import { Waypoint } from "react-waypoint";
import { produce } from "immer";

import { useStreamContent } from "../utils/useStreamContent";
import { filterImgSrcfromHtmlStr } from "../utils/filterImgSrcfromHtmlStr";
import {
  StreamContentItem,
  StreamContentItemWithPageIndex,
  StreamContentsResponse,
} from "../server/inoreader";

import StatusCard, { Status } from "../components/statusCard";
import SourcesPanel from "../components/sourcePanel";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { getRootStreamId } from "../utils/getRootSteamId";
import server from "../server";
import { InfiniteData, useQueryClient } from "react-query";
import { getStreamContentQueryKey } from "../utils/getStreamContentQueryKey";

interface Props {}

const getQueryParma = (query: string | string[] | undefined) => {
  if (Array.isArray(query)) {
    return query[0];
  } else {
    return query;
  }
};

export default function Home({}: Props) {
  const [curArticle, setCurArticle] = useState<StreamContentItem | null>(null);
  const [isAritleTitleShow, setIsAritleTitleShow] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const router = useRouter();
  const streamId =
    getQueryParma(router.query.streamId) ?? getRootStreamId(userId);
  const unreadOnly = !!getQueryParma(router.query.unreadOnly);

  const streamContentQueryKey = getStreamContentQueryKey({
    unreadOnly,
    userId,
    streamId,
  });
  const streamContentQuery = useStreamContent(streamContentQueryKey);
  const articleScrollContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<IList>(null);
  const queryClient = useQueryClient();

  const streamContentListItems = useMemo(() => {
    const initList: StreamContentItemWithPageIndex[] = [];
    if (!streamContentQuery.data || !streamContentQuery.data.pages) {
      return initList;
    }
    const { pages } = streamContentQuery.data;
    const items = pages.reduce(
      (acc, cur, idx) =>
        acc.concat(cur.items.map((item) => ({ ...item, pageIndex: idx }))),
      initList
    );
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

  const markAsRead = async (target: StreamContentItemWithPageIndex) => {
    try {
      queryClient.setQueryData(
        streamContentQueryKey,
        produce<InfiniteData<StreamContentsResponse>>((draft) => {
          const { items } = draft.pages[target.pageIndex];
          const draftTarget = items.find(({ id }) => id === target.id);
          if (draftTarget) {
            draftTarget!.isRead = !target.isRead;
          }
        })
      );
      await server.inoreader.markArticleAsRead(target.id, target.isRead);
    } catch (error) {}
  };

  const onRenderCell = (
    item?: StreamContentItemWithPageIndex,
    index?: number
  ): React.ReactNode => {
    if (!item) return null;
    const { title } = item;

    const onRead = () => markAsRead(item);

    const onClickTitle = () => {
      setCurArticle(item);
      if (!item.isRead) {
        markAsRead(item);
      }
    };

    const isSelected = curArticle?.id === item.id;

    return (
      <>
        <div
          data-is-focusable={true}
          className={`flex space-x-4 mb-3 p-3 rounded-lg ${
            !isSelected && item?.isRead ? "opacity-30" : ""
          } ${isSelected ? "ring-2 ring-inset bg-white" : ""}`}
        >
          <div className="shrink-0">
            <Image
              src={filterImgSrcfromHtmlStr(item.summary.content)}
              width={80}
              height={80}
              imageFit={ImageFit.cover}
              className="bg-gray-300 rounded-md"
              alt=""
            />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <Text onClick={onClickTitle} className="cursor-pointer" block>
                {title}
              </Text>
            </div>
            <div className="flex items-center">
              <Text className="text-xs text-gray-400 flex-1">
                {item.origin.title}
              </Text>
              <div className=" shrink-0">
                <IconButton
                  iconProps={{
                    iconName: item.isRead ? "CompletedSolid" : "Completed",
                  }}
                  onClick={onRead}
                />
              </div>
            </div>
          </div>
        </div>
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
        componentRef={listRef}
      />
    );
  };

  const onClickRefresh = () => {
    listRef.current?.scrollToIndex(0);
    queryClient.refetchQueries(streamContentQueryKey)
  };

  return (
    <div
      className="grid grid-cols-24 relative h-screen overflow-hidden bg-gray-100 divide-x"
      style={{
        gridTemplateRows: `48px auto`,
      }}
    >
      <div className="flex items-center justify-between row-start-1 col-span-4 bg-white px-4">
        <Text className="text-lg font-bold">Feeds</Text>
        <Link href="/settings" passHref>
          <a>
            <IconButton iconProps={{ iconName: "Settings" }} />
          </a>
        </Link>
      </div>
      <div className="flex items-center row-start-1 col-span-7 bg-gray-50 px-4">
        <Text className="text-lg font-bold">未读文章</Text>
        <DefaultButton
          iconProps={{ iconName: "Refresh" }}
          onClick={onClickRefresh}
          className="ml-auto mr-0"
        >
          刷新
        </DefaultButton>
      </div>
      <div className="flex items-center row-start-1 col-span-13 bg-white px-4">
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
      </div>
      <div className="row-start-2 col-span-4 sticky top-0 overflow-y-scroll scrollbar bg-white">
        <SourcesPanel userId={userId} />
      </div>
      <div
        className="row-start-2 col-span-7 overflow-y-scroll scrollbar bg-gray-50 px-2"
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

export const getServerSideProps: GetServerSideProps<
  any,
  {
    unreadOnly: string;
    userId: string;
    streamId: string;
  }
> = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};
