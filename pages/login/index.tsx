import React from "react";
import { GetStaticProps } from "next";
import { getAuthUri } from "./../../utils/auth";
import { useRouter } from "next/router";
import { StorageKeys } from "../../constants";
import { PrimaryButton } from "@fluentui/react";
import { useSession, signIn, signOut } from "next-auth/react";

interface Props {
  inoreaderAuthUri: string;
}

export default function Login({ inoreaderAuthUri }: Props) {
  const { data: session } = useSession();
  const handleLogin = async () => {
    if (session) {
      signOut();
    } else {
      signIn();
    }
  };

  return (
    <div>
      <PrimaryButton onClick={handleLogin} className="">
        {session ? "退出登录" : "用 inoreader 账号登录"}
      </PrimaryButton>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      inoreaderAuthUri: getAuthUri(),
    },
  };
};
