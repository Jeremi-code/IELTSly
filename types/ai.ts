export type AIProvider = "gemini" | "openai";

export interface AICredentialStatus {
  isConnected: boolean;
  provider?: AIProvider;
  maskedKey?: string;
  model?: string;
}
