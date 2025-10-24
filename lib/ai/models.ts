/**
 * Chat Model Configuration
 * 
 * These models are available in the UI dropdown for users to select.
 * Model IDs must match with the languageModels keys in providers.ts
 */

export const DEFAULT_CHAT_MODEL: string = "chat-model";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

/**
 * Available chat models for UI selection
 * 
 * Note: title-model and artifact-model are internal models
 * and should not be exposed in the UI dropdown
 */
export const chatModels: ChatModel[] = [
  {
    id: "chat-model",
    name: "GPT-4o",
    description: "⚡ Fast & intelligent - Best for general chat and coding",
  },
  {
    id: "chat-model-reasoning",
    name: "GPT-4o (Reasoning)",
    description: "💎 Deep reasoning mode - Best for complex analysis",
  },
];
