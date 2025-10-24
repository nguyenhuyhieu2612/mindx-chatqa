"use client";

import { useEffect, useRef, useState } from "react";
import { useDataStream } from "@/components/data-stream-provider";

export function useFollowUpQuestions() {
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const { dataStream } = useDataStream();
  const lastProcessedIndex = useRef(-1);

  useEffect(() => {
    if (!dataStream?.length) {
      return;
    }

    const newDeltas = dataStream.slice(lastProcessedIndex.current + 1);
    lastProcessedIndex.current = dataStream.length - 1;

    for (const delta of newDeltas) {
      if (delta.type === "data-followup") {
        setFollowUpQuestions((prev) => {
          // Limit to maximum 3 questions
          const updated = [...prev, delta.data];
          return updated.slice(0, 3);
        });
      }
    }
  }, [dataStream]);

  const clearFollowUpQuestions = () => {
    setFollowUpQuestions([]);
  };

  return {
    followUpQuestions,
    clearFollowUpQuestions,
  };
}

