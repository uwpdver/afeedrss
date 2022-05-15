import React from "react";
import { GetStaticProps } from "next";
import { getAuthUri } from "./../../utils/auth";
import { useRouter } from "next/router";
import { StorageKeys } from "../../constants";
import { PrimaryButton } from "@fluentui/react";

interface Props {
  inoreaderAuthUri: string;
}

export default function Login({ inoreaderAuthUri }: Props) {
  const router = useRouter();
  const handleLogin = async () => {
    window.open(inoreaderAuthUri);
    addEventListener(
      "storage",
      (e: StorageEvent) => {
        if (e.key === StorageKeys.INOREADER_TOKEN) {
          if (e.newValue !== "") {
            router.replace("/feed");
          }
        }
      },
      { once: true }
    );
  };

  return (
    <div>
      <PrimaryButton onClick={handleLogin} className="">
        用 inoreader 账号登录
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
