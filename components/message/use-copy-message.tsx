"use client";
import { MessageWithAuthor } from "@/db/schemas/messages";
import { useEffect, useState } from "react";

const copyDelay = 1000;

export function useCopyMessage({ content }: MessageWithAuthor) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    navigator.clipboard.writeText(content).then(() => setCopySuccess(true));
  };

  useEffect(() => {
    const timer = setTimeout(() => setCopySuccess(false), copyDelay);
    return () => clearTimeout(timer);
  }, [copySuccess]);

  return { handleCopy, copySuccess };
}
