import React from "react";
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from "next-auth/react";
import { GetServerSideProps } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import { PrimaryButton } from "@fluentui/react";

interface Props {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}

export default function SignIn({ providers }: Props) {
  return (
    <div className="w-48 mx-auto mt-12">
      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <PrimaryButton
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            >
              {`登录 ${provider.name} 账号`}
            </PrimaryButton>
          </div>
        ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
