"use client";
import { useState } from "react";
import { saveTransaction } from "@/app/actions";

type Category = { id: string; name: string; type: "income" | "expense" };
type Item = { id: string; description: string; amount: number; date: string; notes: string | null; type: "income" | "expense"; categoryId: string };
export function TransactionForm({ categories, item }: { categories: Category[]; item?: Item }) {
  const [open, setOpen] = useState(false); const [type, setType] = useState<"income" | "expense">(item?.type || "expense");
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  return <><button className={item ? "subtle" : "primary"} onClick={() => setOpen(true)}>{item ? "Editar" : "+ Nova movimentação"}</button>
    {open && <div className="overlay" onClick={() => setOpen(false)}><section className="dialog" role="dialog" aria-modal="true" aria-label="Movimentação" onClick={e => e.stopPropagation()}>
      <div className="dialog-head"><div><span className="eyebrow">SEU DINHEIRO, EM DIA</span><h2>{item ? "Editar movimentação" : "Nova movimentação"}</h2></div><button className="subtle" onClick={() => setOpen(false)} aria-label="Fechar">✕</button></div>
      <form action={async form => { setBusy(true); setError(""); try { await saveTransaction(form); setOpen(false); } catch { setError("Não foi possível salvar. Confira os dados e tente novamente."); } finally { setBusy(false); } }}>
        <input type="hidden" name="id" value={item?.id || ""}/><label>Tipo<select name="type" value={type} onChange={e => setType(e.target.value as "income" | "expense")}><option value="expense">Despesa</option><option value="income">Receita</option></select></label>
        <label>Descrição<input name="description" required maxLength={120} defaultValue={item?.description} placeholder="Ex.: Mercado do mês"/></label>
        <div className="form-row"><label>Valor (R$)<input name="amount" required inputMode="decimal" defaultValue={item ? (item.amount / 100).toFixed(2).replace(".", ",") : ""} placeholder="0,00"/></label><label>Data<input type="date" name="date" required defaultValue={item?.date || new Date().toLocaleDateString("sv-SE")}/></label></div>
        <label>Categoria<select key={type} name="categoryId" required defaultValue={item?.type === type ? item.categoryId : ""}><option value="" disabled>Selecione uma categoria</option>{categories.filter(c => c.type === type).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <label>Observação <span className="muted">(opcional)</span><textarea name="notes" maxLength={1000} defaultValue={item?.notes || ""} rows={2}/></label>
        {error && <p role="alert" className="error">{error}</p>}<button className="primary full" disabled={busy}>{busy ? "Salvando..." : "Salvar movimentação"}</button>
      </form></section></div>}</>;
}
