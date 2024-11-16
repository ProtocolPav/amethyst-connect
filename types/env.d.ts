// types/env.d.ts
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GUILD_ID: string;  // Add other environment variables as needed
    }
  }
}