"use client";
import { deleteTransaction } from "@/app/actions";
export function DeleteButton({ id }: { id: string }) { return <form action={deleteTransaction} onSubmit={e => { if (!confirm("Excluir esta movimentação?")) e.preventDefault(); }}><input name="id" value={id} type="hidden"/><button className="subtle danger">Excluir</button></form>; }
