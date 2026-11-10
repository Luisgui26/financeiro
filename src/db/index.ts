import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

export function database() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada");
  return drizzle(neon(process.env.DATABASE_URL));
}
