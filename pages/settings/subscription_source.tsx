import {
  DefaultButton,
  GroupedList,
  SelectionMode,
  Text,
  IGroup,
  Stack,
  StackItem,
  IGroupHeaderProps,
  IconButton,
  Modal,
  Dropdown,
  Label,
  TextField,
  IDropdownOption,
  DetailsRow,
  IColumn,
  Selection,
  PrimaryButton,
} from "@fluentui/react";
import { useSession } from "next-auth/react";
import React, { FormEventHandler, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";

import SettingsLayout from "../../components/settings/layout";
import {
  useSubscriptionsListQuery,
  useFolderQuery,
  useStreamPreferencesQuery,
} from "../../components/sourcePanel/utils";
import { QUERY_KEYS } from "../../constants";
import server from "../../server";
import { Subscription } from "../../types";
import { getTagNameFromId } from "../../utils/subscriptionNavTreeBuilder";
import SubscriptionGroupedListBuilder from "./../../utils/subscriptionListTreeBuilder";
import { getLayout } from "../../components/home/layout";

interface Props {}

function SubscriptionSource({}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [seletedIndex, setSeletedIndex] = useState(-1);
  const [selectedFolder, setSelectedFolder] = useState<IDropdownOption>();
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const queryClient = useQueryClient();
  const subscriptionsListQuery = useSubscriptionsListQuery();
  const streamPreferencesQuery = useStreamPreferencesQuery();
  const folderQuery = useFolderQuery();

  const subscriptionsListData = subscriptionsListQuery.data;
  const folderData = folderQuery.data;
  const streamPreferencesData = streamPreferencesQuery.data;

  const { items, groups } = useMemo(() => {
    if (
      !userId ||
      !subscriptionsListData ||
      !folderData ||
      !streamPreferencesData
    ) {
      return {
        items: [],
        groups: [],
      };
    }
    return new SubscriptionGroupedListBuilder({
      userId,
      subscriptionById: subscriptionsListData.entities.subscription,
      tagsById: folderData.entities.folder,
      streamPrefById: streamPreferencesData.streamprefs,
    }).buildGroupedList();
  }, [userId, subscriptionsListData, folderData, streamPreferencesData]);

  const addFeedMutation = useMutation(
    ({ feedUrl, folderId }: { feedUrl: string; folderId: string }) =>
      server.inoreader.addSubscription(`feed/${feedUrl}`, folderId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.SUBSCRIPTIONS_LIST);
        queryClient.invalidateQueries(QUERY_KEYS.STREAM_PREFERENCES);
        queryClient.invalidateQueries(QUERY_KEYS.FOLDER);
      },
      onError: (error) => {
        alert("Failed");
      },
    }
  );

  const selection = useMemo(
    () =>
      new Selection({
        items: items.map((item) => ({ ...item, key: item.id })),
      }),
    [items]
  );

  const columns: IColumn[] = [
    {
      key: "name",
      name: "名字",
      fieldName: "title",
      minWidth: 400,
    },
  ];

  const onRenderCell = (
    nestingDepth?: number,
    item?: Subscription,
    itemIndex?: number,
    group?: IGroup
  ) => {
    return item && typeof itemIndex === "number" && itemIndex > -1 ? (
      <DetailsRow
        columns={columns}
        groupNestingDepth={nestingDepth}
        item={item}
        itemIndex={itemIndex}
        selectionMode={SelectionMode.multiple}
        group={group}
      />
    ) : null;
  };

  const onRenderHeader = (props?: IGroupHeaderProps) => {
    if (!props) return null;
    const toggleCollapse = () => {
      props.onToggleCollapse!(props.group!);
    };
    return (
      <Stack
        className="group"
        horizontal
        verticalAlign="center"
        tokens={{ childrenGap: 8 }}
      >
        <StackItem>
          <IconButton
            iconProps={{
              iconName: props.group!.isCollapsed
                ? "ChevronRight"
                : "ChevronDown",
            }}
            onClick={toggleCollapse}
          />
        </StackItem>
        <StackItem grow>
          <Text className="text-normal font-semibold">{props.group?.name}</Text>
          <Text className="text-normal ml-2">{`(${props.group?.count})`}</Text>
        </StackItem>
        <StackItem className="hidden group-hover:flex">
          <DefaultButton iconProps={{ iconName: "Rename" }}>
            重命名
          </DefaultButton>
        </StackItem>
      </Stack>
    );
  };

  const handleDropdownChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption,
    index?: number
  ) => {
    setSelectedFolder(option);
  };

  const handleOnSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    const form =  e.target as typeof e.target & {
      feedUrl: { value: string };
    };
    const feedUrl = form["feedUrl"].value;
    addFeedMutation.mutate({ feedUrl, folderId: String(selectedFolder?.key) });
  };

  const dropdownOptions: IDropdownOption[] = useMemo(() => {
    if (folderData) {
      const {
        entities: { folder },
        result,
      } = folderData;
      return result
        .filter((key) => folder[key].type === "folder")
        .map((key) => ({
          key: folder[key].id,
          text: getTagNameFromId(folder[key].id),
        }));
    } else {
      return [];
    }
  }, [folderData]);

  return (
    <SettingsLayout
      title="订阅源"
      tailElem={
        <DefaultButton
          iconProps={{ iconName: "Add" }}
          onClick={() => setIsDialogOpen(true)}
        >
          添加订阅源
        </DefaultButton>
      }
    >
      <GroupedList
        selectionMode={SelectionMode.multiple}
        items={items}
        groups={groups}
        // groupProps={{
        //   onRenderHeader,
        // }}
        onRenderCell={onRenderCell}
        onShouldVirtualize={() => false}
      />

      <Modal isOpen={isDialogOpen} onDismiss={() => setIsDialogOpen(false)}>
        <form onSubmit={handleOnSubmit}>
          <Stack horizontal verticalAlign="center" className="py-1 pl-4 pr-2">
            <StackItem grow>
              <Text>添加订阅源</Text>
            </StackItem>
            <StackItem>
              <IconButton
                iconProps={{ iconName: "Cancel" }}
                onClick={() => setIsDialogOpen(false)}
              />
            </StackItem>
          </Stack>
          <Stack>
            <div className="p-8">
              <Stack>
                <Label>订阅源 URL</Label>
                <TextField
                  name="feedUrl"
                  placeholder={""}
                  className="w-96 max-w-full mb-4"
                  required
                />
                <Label>添加到文件夹</Label>
                <Dropdown
                  selectedKey={selectedFolder ? selectedFolder.key : undefined}
                  options={dropdownOptions}
                  placeHolder={""}
                  onChange={handleDropdownChange}
                />
              </Stack>
            </div>
            <Stack
              className="px-8 py-6"
              styles={{
                root: ["bg-green-100"],
              }}
              horizontal
              horizontalAlign="end"
              verticalAlign="center"
              tokens={{ childrenGap: "16px" }}
            >
              <Stack.Item grow={1}>
                <DefaultButton
                  className="w-full"
                  onClick={() => setIsDialogOpen(false)}
                  text="取消"
                />
              </Stack.Item>
              <Stack.Item grow={1}>
                <PrimaryButton
                  className="w-full"
                  disabled={addFeedMutation.isLoading}
                  type="submit"
                  text="添加"
                />
              </Stack.Item>
            </Stack>
          </Stack>
        </form>
      </Modal>
    </SettingsLayout>
  );
}

SubscriptionSource.getLayout = getLayout;

export default SubscriptionSource;