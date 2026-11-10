import { config } from "dotenv";
config({ path: ".env.local" });
import { database } from "./index";
import { categories } from "./schema";

const expenses = ["Moradia", "Saúde", "Alimentação", "Energia", "Carros", "Impostos", "Seguro", "Empréstimo", "Academia", "Aluguel", "Pets", "Assinaturas", "Roupas", "Lazer", "Extra"];
const incomes = ["Salário", "Freelance", "Investimentos", "Vendas", "Outros"];
async function main() {
  const rows = [
    ...expenses.map((name, i) => ({ name, type: "expense" as const, icon: "circle", color: ["#64748b", "#f87171", "#f59e0b", "#eab308", "#6366f1", "#94a3b8", "#0ea5e9", "#8b5cf6", "#14b8a6", "#a78bfa", "#fb7185", "#38bdf8", "#d946ef", "#f97316", "#78716c"][i] })),
    ...incomes.map((name) => ({ name, type: "income" as const, icon: "circle", color: "#16a34a" })),
  ];
  await database().insert(categories).values(rows).onConflictDoNothing();
  console.log("Categorias inseridas.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
