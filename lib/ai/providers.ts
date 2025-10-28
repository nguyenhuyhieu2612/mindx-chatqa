import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { customProvider } from "ai";
import {  isDevelopmentEnvironment, isTestEnvironment } from "../constants";
import { google } from "@ai-sdk/google";


const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

console.log(`isTestEnvironment: ${isTestEnvironment}, isDevelopmentEnvironment: ${isDevelopmentEnvironment}`);

const model = isTestEnvironment
  ? (() => {
      console.log("Using mock models for test environment");
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
    })() :
    isDevelopmentEnvironment ? (() => {
        console.log("Using Google models for development environment");
        return customProvider({
          languageModels: {
            "chat-model": google.chat("gemini-2.5-flash"),
            "chat-model-reasoning": google.chat("gemini-2.5-flash"),
            "title-model": google.chat("gemini-2.5-flash"),
            "artifact-model": google.chat("gemini-2.5-flash"),
          },
        })
    })()
    : (() => {
        console.log("Using OpenRouter models for production environment");
        // return customProvider({
        //   languageModels: {
        //     "chat-model": openrouter.chat("openai/gpt-4o"),
        //     "chat-model-reasoning": openrouter.chat("openai/gpt-4o"),
        //     "title-model": openrouter.chat("openai/gpt-4o-mini"),
        //     "artifact-model": openrouter.chat("openai/gpt-4o-mini"),
        //   },
        // })
          return customProvider({
          languageModels: {
            "chat-model": google.chat("gemini-2.5-flash"),
            "chat-model-reasoning": google.chat("gemini-2.5-flash"),
            "title-model": google.chat("gemini-2.5-flash"),
            "artifact-model": google.chat("gemini-2.5-flash"),
          },
        })
    })()

export const myProvider = model;
 
