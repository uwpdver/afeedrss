import React from "react";
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from "next-auth/react";
import { GetServerSideProps } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import Image from "next/image";
import { Stack, DefaultButton, StackItem, PrimaryButton } from "@fluentui/react";

interface Props {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}

export default function SignIn({ providers }: Props) {
  return (
    <Stack
      className="w-screen min-h-screen bg-gray-100 "
      horizontalAlign="center"
      verticalAlign="center"
    >
      <Stack className="rounded-lg bg-gray-50 shadow-lg p-12" horizontalAlign="center">
        <StackItem className="mb-4" disableShrink>
          <Image
            src="/images/3d-fluency-airplane-take-off.png"
            width={200}
            height={200}
            alt=""
            objectFit="contain"
          />
        </StackItem>
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
      </Stack>
    </Stack>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
