import React from "react";
import { DefaultButton } from "@fluentui/react";
import { signOut } from "next-auth/react";
import SettingsLayout from "../../components/settings/layout";
import { getLayout } from "../../components/home/layout";

interface Props {}

function Account({}: Props) {
  const onClickSignout = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };
  return (
    <SettingsLayout
      title="账户"
      tailElem={
        <DefaultButton
          onClick={onClickSignout}
          iconProps={{ iconName: "Leave" }}
        >
          退出登录
        </DefaultButton>
      }
    >
    </SettingsLayout>
  );
}

Account.getLayout = getLayout;

export default Account;