import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useRouter } from "next/router";
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
  OverflowSet,
} from "@fluentui/react";
import { Waypoint } from "react-waypoint";
import { produce } from "immer";
import Head from "next/head";

import { useStreamContent } from "../utils/useStreamContent";
import { filterImgSrcfromHtmlStr } from "../utils/filterImgSrcfromHtmlStr";
import { StreamContentItem, StreamContentsResponse } from "../server/inoreader";

import StatusCard, { Status } from "../components/statusCard";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { getRootStreamId } from "../utils/getRootSteamId";
import server from "../server";
import { InfiniteData, useQueryClient } from "react-query";
import { getStreamContentQueryKey } from "../utils/getStreamContentQueryKey";
import dayjs from "../utils/dayjs";
import { GlobalSettingsCtx } from "./_app";
import { getLayout } from "../components/home/layout";
import { GlobalNavigationCtx } from "./../components/home/layout";
import Swipeout from "../components/swipeout";

interface Props {}

interface StreamContentItemWithPageIndex extends StreamContentItem {
  pageIndex: number;
}

const getQueryParma = (query: string | string[] | undefined) => {
  if (Array.isArray(query)) {
    return query[0];
  } else {
    return query;
  }
};

function Home({}: Props) {
  const {
    globalSettings: { showFeedThumbnail },
  } = useContext(GlobalSettingsCtx);
  const { setIsOpen } = useContext(GlobalNavigationCtx);
  const [curArticle, setCurArticle] = useState<StreamContentItem | null>(null);
  const [isArticlePanelOpen, setIsArticlePanelOpen] = useState(false);
  const [isAritleTitleShow, setIsAritleTitleShow] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const router = useRouter();
  const [unreadOnly, setUnreadOnly] = useState(() => {
    return !!getQueryParma(router.query.unreadOnly);
  });
  const streamId =
    getQueryParma(router.query.streamId) ?? getRootStreamId(userId);
  const articleId = router?.query?.articleId;
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

  useEffect(() => {
    if (articleId) {
    } else {
      setIsArticlePanelOpen(false);
    }
  }, [articleId]);

  const onEnterWaypoint = useCallback(() => {
    if (streamContentQuery.hasNextPage) {
      streamContentQuery.fetchNextPage();
    }
  }, [streamContentQuery]);

  const markAsRead = useCallback(
    async (target: StreamContentItemWithPageIndex) => {
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
    },
    [queryClient, streamContentQueryKey]
  );

  const markAboveAsRead = useCallback(
    async (target: StreamContentItemWithPageIndex, isRead: boolean) => {
      try {
        const pendingIds: string[] = [];
        queryClient.setQueryData(
          streamContentQueryKey,
          produce<InfiniteData<StreamContentsResponse>>((draft) => {
            for (const key in draft.pages) {
              if (Object.prototype.hasOwnProperty.call(draft.pages, key)) {
                const { items } = draft.pages[key];
                if (Number(key) < target.pageIndex) {
                  items.forEach((item) => {
                    if (!item.isRead !== isRead) {
                      item.isRead = isRead;
                      pendingIds.push(item.id);
                    }
                  });
                } else if (Number(key) === target.pageIndex) {
                  let hasFind = false;
                  items.forEach((item) => {
                    if (!hasFind) {
                      if (item.isRead !== isRead) {
                        item.isRead = isRead;
                        pendingIds.push(item.id);
                      }
                      if (item.id === target.id) {
                        hasFind = true;
                      }
                    }
                  });
                }
              }
            }
          })
        );
        await server.inoreader.markArticleAsRead(pendingIds, !isRead);
      } catch (error) {}
    },
    [queryClient, streamContentQueryKey]
  );

  const onRenderCell = useCallback(
    (
      item?: StreamContentItemWithPageIndex,
      index?: number
    ): React.ReactNode => {
      if (!item) return null;
      const { title } = item;

      const isSelected = curArticle?.id === item.id;
      const onRead: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        e.preventDefault();
        markAsRead(item);
      };

      const onReadAbove: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        markAboveAsRead(item, true);
      };

      const onClickTitle = () => {
        const href = `/?articleId=${item.id}`;
        router.push(href, href, { shallow: true });
        setCurArticle(item);
        setIsArticlePanelOpen(true);
        if (!item.isRead) {
          markAsRead(item);
        }
      };

      return (
        <>
          <Swipeout
            className="mb-3"
            leftBtnsProps={[
              {
                className: "bg-yellow-300 text-white font-medium",
                text: "已读",
                onClick: onRead,
              },
              {
                className: "bg-yellow-400 text-white font-medium",
                text: "上方已读",
                onClick: onReadAbove,
              },
            ]}
            overswipeRatio={0.3}
            btnWidth={96}
          >
            <div
              data-is-focusable={true}
              className={`flex space-x-4 px-4 cursor-pointer break-all hover:bg-blue-100 transition ${
                !isSelected && item?.isRead ? "opacity-30" : ""
              } ${isSelected ? "bg-white" : ""} ${
                showFeedThumbnail ? "py-3" : "items-center"
              }`}
              onClick={onClickTitle}
            >
              {showFeedThumbnail ? (
                <>
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
                      <Text className="cursor-pointer" block>
                        {title}
                      </Text>
                    </div>
                    <div className="flex items-center">
                      <Text className="text-xs text-gray-400 flex-1">
                        {`${item.origin.title}/ ${dayjs(
                          item?.published * 1000
                        ).fromNow()}`}
                      </Text>
                      <div className="hidden shrink-0 sm:block">
                        <IconButton
                          iconProps={{
                            iconName: item.isRead
                              ? "CompletedSolid"
                              : "Completed",
                          }}
                          onClick={onRead}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Text className="flex-1 cursor-pointer" block nowrap>
                    {title}
                  </Text>
                  <Text
                    className="shrink-0 basis-48 text-xs text-gray-400 break-all"
                    block
                    nowrap
                  >
                    {`${item.origin.title}/ ${dayjs(
                      item?.published * 1000
                    ).fromNow()}`}
                  </Text>
                  <div className="hidden shrink-0 sm:block">
                    <IconButton
                      iconProps={{
                        iconName: item.isRead ? "CompletedSolid" : "Completed",
                      }}
                      onClick={onRead}
                    />
                  </div>
                </>
              )}
            </div>
          </Swipeout>

          {index === streamContentListItems.length - 1 ? (
            <Waypoint onEnter={onEnterWaypoint} />
          ) : null}
        </>
      );
    },
    [
      curArticle?.id,
      markAsRead,
      markAboveAsRead,
      onEnterWaypoint,
      streamContentListItems.length,
      showFeedThumbnail,
      router,
    ]
  );

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
        version={[onRenderCell]}
      />
    );
  };

  const onClickRefresh = () => {
    listRef.current?.scrollToIndex(0);
    queryClient.refetchQueries(streamContentQueryKey);
  };

  const onClickFilter = () => {
    setUnreadOnly((state) => !state);
  };

  const midElem = (
    <Stack
      className={`overflow-y-scroll scrollbar bg-gray-50 transition-all`}
      style={{
        transform: isArticlePanelOpen
          ? "translateX(-100%) opacity-0"
          : "translateX(0) opacity-100",
        opacity: isArticlePanelOpen ? 0 : 1,
      }}
    >
      {/* head */}
      <Stack className="sticky -top-12 bg-inherit z-10 pt-16 pb-4 px-6 sm:px-12">
        <Stack className="flex sm:hidden mb-2" horizontal>
          <IconButton
            iconProps={{ iconName: "GlobalNavButton" }}
            onClick={() => setIsOpen(true)}
            className="mr-3"
          />
        </Stack>
        <Stack
          className=""
          horizontal
          verticalAlign="center"
          horizontalAlign="space-between"
        >
          <StackItem grow>
            <Text className="text-lg font-bold mr-auto">
              {unreadOnly ? "未读文章" : "全部文章"}
            </Text>
          </StackItem>
          <StackItem disableShrink>
            <OverflowSet
              items={[
                {
                  key: "filter",
                  text: unreadOnly ? "全部" : "仅未读",
                  iconOnly: true,
                  checked: unreadOnly,
                  iconProps: {
                    iconName: unreadOnly ? "FilterSolid" : "Filter",
                  },
                  onClick: onClickFilter,
                },
                {
                  key: "refresh",
                  text: "刷新",
                  iconOnly: true,
                  iconProps: { iconName: "Refresh" },
                  onClick: onClickRefresh,
                },
              ]}
              overflowItems={[]}
              onRenderItem={(item) => <DefaultButton {...item} />}
              onRenderOverflowButton={(props, defaultRender) =>
                defaultRender!(props)
              }
            />
          </StackItem>
        </Stack>
      </Stack>

      {/* content */}
      <div className="sm:px-10" data-is-scrollable="true">
        {onRenderList()}
        <div className="flex justify-center w-full p-4">
          {streamContentQuery.isFetching && <Spinner />}
        </div>
      </div>
    </Stack>
  );

  const handleCloseArticle = () => {
    router.back();
  };

  const articlePaneElem = (
    <Stack
      className="absolute inset-0 h-full z-10 bg-gray-50 transition-all ease-in"
      style={{
        transform: isArticlePanelOpen ? "translateX(0)" : "translateX(100%)",
      }}
    >
      <Stack
        className="px-6 sm:px-12 py-4"
        horizontal
        verticalAlign="center"
        tokens={{ childrenGap: 12 }}
      >
        <StackItem className="overflow-hidden" grow>
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
        <StackItem className="ml-3 mr-0" disableShrink>
          <IconButton
            iconProps={{ iconName: "Cancel" }}
            onClick={handleCloseArticle}
          />
        </StackItem>
      </Stack>

      <Stack className="relative" disableShrink grow>
        <div
          className="overflow-y-scroll scrollbar w-full h-full absolute top-0 left-0  px-6 sm:px-12 "
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
                  <Text className="text-gray-400 text-sm">{`${
                    curArticle?.origin.title
                  }/${dayjs(curArticle?.published * 1000).fromNow()}`}</Text>
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
          <hr className="mt-12 mb-16" />
        </div>
      </Stack>
    </Stack>
  );

  return (
    <>
      <Head>
        <title>
          {isArticlePanelOpen
            ? `${curArticle?.title}-RSS 阅读器`
            : "RSS 阅读器"}
        </title>
      </Head>
      {midElem}
      {articlePaneElem}
    </>
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

Home.getLayout = getLayout;

export default Home;
