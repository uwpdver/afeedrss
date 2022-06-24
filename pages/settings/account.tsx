import React from "react";
import { DefaultButton } from "@fluentui/react";
import SettingsLayout from "../../components/settings/layout";
import { signOut } from "next-auth/react";

interface Props {}

export default function Account({}: Props) {
  const onClickSignout = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };
  return (
    <SettingsLayout
      title="账号"
      tailElem={
        <DefaultButton
          onClick={onClickSignout}
          iconProps={{ iconName: "Leave" }}
        >
          退出登录
        </DefaultButton>
      }
    ></SettingsLayout>
  );
}
