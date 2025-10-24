import { tool, type UIMessageStreamWriter } from "ai";
import { z } from "zod";
import type { ChatMessage } from "@/lib/types";

type FollowUpQuestionsProps = {
  dataStream: UIMessageStreamWriter<ChatMessage>;
};

export const generateFollowUpQuestions = ({
  dataStream,
}: FollowUpQuestionsProps) =>
  tool({
    description:
      "Generate EXACTLY 2-3 contextual follow-up questions (MAXIMUM 3) based on the current conversation. MUST be called at the end of every response to help guide the user. Questions should be written from the USER's perspective (what they would ask), not as if you are asking them.",
    inputSchema: z.object({
      questions: z
        .array(z.string())
        .min(2)
        .max(3)
        .describe(
          "Array of EXACTLY 2-3 follow-up questions (MAXIMUM 3) written as direct questions the user would ask (e.g., 'How do I...?', 'What is...?', 'Can you explain...?'). NOT written as 'Have you...?' or 'Do you need...?'"
        ),
    }),
    execute: async ({ questions }) => {
      // Ensure maximum 3 questions
      const limitedQuestions = questions.slice(0, 3);

      // Stream each question to the frontend
      for (const question of limitedQuestions) {
        dataStream.write({
          type: "data-followup",
          data: question,
          transient: true,
        });
      }

      return {
        message: `Generated ${limitedQuestions.length} follow-up questions`,
        questions: limitedQuestions,
      };
    },
  });

