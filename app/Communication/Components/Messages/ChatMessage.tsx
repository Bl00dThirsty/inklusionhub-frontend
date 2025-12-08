"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import clsx from "clsx";

interface ChatMessageProps {
  type: "sent" | "received" | "image";
  text?: string;
  image?: string;
  timestamp?: string;
}

export default function ChatMessage({ type, text, image, timestamp }: ChatMessageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div ref={ref} className={clsx("flex w-full", type === "sent" ? "justify-end" : "justify-start")}>
      <div className={clsx("max-w-[70%] flex flex-col", type === "sent" ? "items-end" : "items-start")}>
        {type !== "image" && (
          <p className={clsx(
            "px-4 py-2 text-sm rounded-xl shadow-sm",
            type === "sent"
              ? "bg-[#82EFCF] text-black rounded-br-none"
              : "bg-gray-200 text-black rounded-bl-none"
          )}>
            {text}
          </p>
        )}
        {type === "image" && image && (
          <Image src={image} alt="Message image" width={200} height={200} className="rounded-xl shadow-md" />
        )}
        <span className="text-[10px] text-gray-500 mt-1">
          {timestamp || new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
