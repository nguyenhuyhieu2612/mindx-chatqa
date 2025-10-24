import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { customProvider } from "ai";
import {  isTestEnvironment } from "../constants";


const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

const model = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      
      
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
    : customProvider({
          languageModels: {
            "chat-model": openrouter.chat("openai/gpt-4o"),
            "chat-model-reasoning": openrouter.chat("openai/gpt-4o"),
            "title-model": openrouter.chat("openai/gpt-4o-mini"),
            "artifact-model": openrouter.chat("openai/gpt-4o-mini"),
          },
        })

export const myProvider = model;
 
