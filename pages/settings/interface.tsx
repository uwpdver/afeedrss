import React from "react";
import { Stack, DefaultButton, Label, Toggle } from "@fluentui/react";
import SettingsLayout from "../../components/settings/layout";
import { GlobalSettingsCtx } from "./../_app";

interface Props {}

export default function Account({}: Props) {
  const { globalSettings, setGlobalSettings } =
    React.useContext(GlobalSettingsCtx);
  const handleOnShowFeedThumbnailToggleChange = (
    event: React.MouseEvent<HTMLElement>,
    checked?: boolean
  ) => {
    setGlobalSettings((prevState) => ({
      ...prevState,
      showFeedThumbnail: Boolean(checked),
    }));
  };
  return (
    <SettingsLayout title="界面">
      <Stack>
        <Label className="text-lg">文章列表</Label>
        <Stack horizontal verticalAlign="center">
          <Toggle
            onText="是"
            offText="否"
            checked={globalSettings.showFeedThumbnail}
            label="显示缩略图"
            onChange={handleOnShowFeedThumbnailToggleChange}
            styles={{
              root: 'flex items-center justify-between w-full'
            }}
          />
        </Stack>
      </Stack>
    </SettingsLayout>
  );
}
