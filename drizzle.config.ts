import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
config({ path: ".env.local" });
export default defineConfig({ schema: "./src/db/schema.ts", out: "./drizzle-neon", dialect: "postgresql", dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED || "" } });
