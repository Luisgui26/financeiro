"use server";
import { auth } from "@/auth";
import { database } from "@/db";
import { categories, transactions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { parseMoney } from "@/lib/money";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function userId() { const session = await auth(); if (!session?.user?.id) redirect("/login"); return session.user.id; }
export async function saveTransaction(form: FormData) {
  const uid = await userId();
  const data = z.object({ id: z.string().uuid().optional().or(z.literal("")), description: z.string().trim().min(1).max(120), type: z.enum(["income", "expense"]), categoryId: z.string().uuid(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), notes: z.string().trim().max(1000).optional(), amount: z.string() }).parse(Object.fromEntries(form));
  const amount = parseMoney(data.amount);
  const date = new Date(`${data.date}T00:00:00Z`);
  if (!amount || Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== data.date) throw new Error("Valor ou data inválidos");
  const [category] = await database().select({ id: categories.id }).from(categories).where(and(eq(categories.id, data.categoryId), eq(categories.type, data.type)));
  if (!category) throw new Error("Categoria inválida");
  const values = { description: data.description, type: data.type, categoryId: data.categoryId, date: data.date, notes: data.notes || null, amount, updatedAt: new Date() };
  if (data.id) await database().update(transactions).set(values).where(and(eq(transactions.id, data.id), eq(transactions.userId, uid)));
  else await database().insert(transactions).values({ ...values, userId: uid });
  revalidatePath("/", "layout");
}
export async function deleteTransaction(form: FormData) {
  const uid = await userId(); const id = z.string().uuid().parse(form.get("id"));
  await database().delete(transactions).where(and(eq(transactions.id, id), eq(transactions.userId, uid)));
  revalidatePath("/", "layout");
}
