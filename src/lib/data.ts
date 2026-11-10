import { and, eq, gte, lt, ilike, sql } from "drizzle-orm";
import { database } from "@/db";
import { categories, transactions } from "@/db/schema";
import { monthBounds } from "@/lib/money";

export async function monthData(userId: string, month: string) {
  const { start, end } = monthBounds(month); const db = database();
  const condition = and(eq(transactions.userId, userId), gte(transactions.date, start), lt(transactions.date, end));
  const [totals, items, cats, grouped] = await Promise.all([
    db.select({ type: transactions.type, total: sql<string>`sum(${transactions.amount})` }).from(transactions).where(condition).groupBy(transactions.type),
    db.select({ id: transactions.id, description: transactions.description, amount: transactions.amount, date: transactions.date, notes: transactions.notes, type: transactions.type, categoryId: transactions.categoryId, category: categories.name, color: categories.color }).from(transactions).innerJoin(categories, eq(transactions.categoryId, categories.id)).where(condition).orderBy(sql`${transactions.date} desc`, sql`${transactions.createdAt} desc`).limit(200),
    db.select().from(categories).orderBy(categories.name),
    db.select({ name: categories.name, color: categories.color, total: sql<string>`sum(${transactions.amount})` }).from(transactions).innerJoin(categories, eq(categories.id, transactions.categoryId)).where(and(condition, eq(transactions.type, "expense"))).groupBy(categories.name, categories.color).orderBy(sql`sum(${transactions.amount}) desc`),
  ]);
  return { income: Number(totals.find(t => t.type === "income")?.total || 0), expense: Number(totals.find(t => t.type === "expense")?.total || 0), items, categories: cats, grouped: grouped.map(item => ({ ...item, total: Number(item.total) })) };
}
export function selectedMonth(input?: string) { return input && /^\d{4}-(0[1-9]|1[0-2])$/.test(input) ? input : new Date().toLocaleDateString("sv-SE", { timeZone: "America/Fortaleza" }).slice(0, 7); }
export function shiftMonth(month: string, amount: number) { const [y, m] = month.split("-").map(Number); const date = new Date(Date.UTC(y, m - 1 + amount, 1)); return date.toISOString().slice(0, 7); }
export async function history(userId: string, month: string) {
  const start = `${shiftMonth(month, -11)}-01`; const end = monthBounds(month).end;
  const rows = await database().select({ month: sql<string>`to_char(${transactions.date}, 'YYYY-MM')`, type: transactions.type, total: sql<string>`sum(${transactions.amount})` }).from(transactions).where(and(eq(transactions.userId, userId), gte(transactions.date, start), lt(transactions.date, end))).groupBy(sql`to_char(${transactions.date}, 'YYYY-MM')`, transactions.type);
  return Array.from({ length: 12 }, (_, i) => { const key = shiftMonth(month, i - 11); const income = Number(rows.find(r => r.month === key && r.type === "income")?.total || 0); const expense = Number(rows.find(r => r.month === key && r.type === "expense")?.total || 0); return { month: key, income, expense, balance: income - expense }; });
}
export async function transactionPage(userId: string, month: string, filters: { q?: string; type?: string; category?: string; page?: string }) {
  const { start, end } = monthBounds(month); const page = Math.max(1, Math.min(100000, Number.parseInt(filters.page || "1", 10) || 1));
  const conditions = [eq(transactions.userId, userId), gte(transactions.date, start), lt(transactions.date, end)];
  if (filters.q) conditions.push(ilike(transactions.description, `%${filters.q.replace(/[\\%_]/g, "\\$&")}%`));
  if (filters.type === "income" || filters.type === "expense") conditions.push(eq(transactions.type, filters.type));
  if (filters.category && /^[0-9a-f-]{36}$/i.test(filters.category)) conditions.push(eq(transactions.categoryId, filters.category));
  const db = database(); const where = and(...conditions);
  const [items, count, cats] = await Promise.all([
    db.select({ id: transactions.id, description: transactions.description, amount: transactions.amount, date: transactions.date, notes: transactions.notes, type: transactions.type, categoryId: transactions.categoryId, category: categories.name, color: categories.color }).from(transactions).innerJoin(categories, eq(transactions.categoryId, categories.id)).where(where).orderBy(sql`${transactions.date} desc`, sql`${transactions.createdAt} desc`).limit(25).offset((page - 1) * 25),
    db.select({ count: sql<number>`cast(count(*) as integer)` }).from(transactions).where(where),
    db.select().from(categories).orderBy(categories.name),
  ]);
  return { items, categories: cats, page, total: count[0].count };
}
