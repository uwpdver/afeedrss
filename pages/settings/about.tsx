import React from "react";
import { Stack, Image, Text, DefaultButton } from "@fluentui/react";
import SettingsLayout from "../../components/settings/layout";

interface Props {}

export default function Account({}: Props) {
  return (
    <SettingsLayout title="关于">
       <Stack className="text-base space-y-2">
        <Image src="" className="w-24 h-24"  maximizeFrame alt="" />
        <Text className="font-semibold text-lg" block>NoFeeding 0.4.1</Text>
        <Text className="text-base" block>© {new Date().getFullYear()} 要没时间了。</Text>
        <a className="text-blue-600 hover:underline" href="https://github.com/okxfish/nofeeding" target="_blank" rel="noreferrer" >项目仓库</a>
        <a className="text-blue-600 hover:underline" title="">使用条款</a>
        <a className="text-blue-600 hover:underline" title="">隐私策略</a>
      </Stack>
    </SettingsLayout>
  );
}
