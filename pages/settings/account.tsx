import React from "react";
import { DefaultButton } from "@fluentui/react";
import SettingsLayout from "../../components/settings/layout";

interface Props {}

export default function Account({}: Props) {
  return (
    <SettingsLayout title="账号">
      <DefaultButton>退出登录</DefaultButton>
    </SettingsLayout>
  );
}
