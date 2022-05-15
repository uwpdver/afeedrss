import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { getAccessToken } from "../../utils/auth";
import { StorageKeys } from "../../constants";

interface Props {
  accessToken: string;
}

export default function Auth({ accessToken }: Props) {
  useEffect(() => {
    window.localStorage.setItem(StorageKeys.INOREADER_TOKEN, accessToken);
    window.close();
  }, [accessToken]);

  return <h1 className="text-center mt-24">授权成功，将为您跳转到首页···</h1>;
}

export const getServerSideProps: GetServerSideProps<
  any,
  { code: string },
  any
> = async (context) => {
  const { query } = context;
  const code = Array.isArray(query.code) ? query.code[0] : query.code;
  if (code) {
    const res = await getAccessToken(code);
    return {
      props: {
        accessToken: res?.accessToken,
      },
    };
  }
  return { props: {} };
};
