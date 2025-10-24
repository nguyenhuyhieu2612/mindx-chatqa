"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { memo } from "react";
import type { ChatMessage } from "@/lib/types";
import { Suggestion } from "./elements/suggestion";

type FollowUpQuestionsProps = {
  chatId: string;
  questions: string[];
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
};

function PureFollowUpQuestions({
  chatId,
  questions,
  sendMessage,
}: FollowUpQuestionsProps) {
  if (questions.length === 0) {
    return null;
  }

  // Limit to maximum 3 questions
  const limitedQuestions = questions.slice(0, 3);

  return (
    <div
      className="flex w-full gap-2 overflow-x-auto"
      data-testid="follow-up-questions"
    >
      {limitedQuestions.map((question, index) => (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="shrink-0"
          exit={{ opacity: 0, y: 20 }}
          initial={{ opacity: 0, y: 20 }}
          key={`${question}-${index}`}
          transition={{ delay: 0.05 * index }}
        >
          <Suggestion
            className="max-w-[280px] overflow-hidden text-ellipsis whitespace-nowrap p-3 text-left sm:max-w-[320px]"
            onClick={(suggestion) => {
              window.history.replaceState({}, "", `/chat/${chatId}`);
              sendMessage({
                role: "user",
                parts: [{ type: "text", text: suggestion }],
              });
            }}
            suggestion={question}
          >
            {question}
          </Suggestion>
        </motion.div>
      ))}
    </div>
  );
}

export const FollowUpQuestions = memo(PureFollowUpQuestions);

