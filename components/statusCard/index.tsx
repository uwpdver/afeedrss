import React from "react";
import Image from "next/image";

interface Props {
  content?: React.ReactNode;
  status: Status;
}

export enum Status {
  EMPTY = 0,
  ERROR = 1,
}

const StatusImageMap = {
  [Status.EMPTY]: "/images/3d-fluency-spiderweb.png",
  [Status.ERROR]: "/images/3d-fluency-bandage.png",
};

export default function StatusCard({ content, status }: Props) {
  return (
    <div className="pt-20 flex flex-col items-center">
      <Image
        src={StatusImageMap[status]}
        width={120}
        height={120}
        alt=""
        objectFit="contain"
      />
      <div className="text-sm text-gray-500 mt-6">{content}</div>
    </div>
  );
}
