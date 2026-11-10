"use client";
import { createAuthClient } from "@neon/auth/next";
import { useRouter } from "next/navigation";
import { useState } from "react";
const client = createAuthClient();
export function AuthForm({ register = false }: { register?: boolean }) {
 const router = useRouter(); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
 return <form onSubmit={async e => { e.preventDefault(); setBusy(true); setError(""); const form = new FormData(e.currentTarget); try { const email = String(form.get("email")).trim().toLowerCase(); const password = String(form.get("password")); const result = register ? await client.signUp.email({ email, password, name: String(form.get("name")).trim() }) : await client.signIn.email({ email, password }); if (result.error) { setError(register ? "Não foi possível criar a conta. Confira os dados e tente novamente." : "E-mail ou senha inválidos."); return; } router.push("/dashboard"); router.refresh(); } catch { setError("Não foi possível conectar. Tente novamente."); } finally { setBusy(false); } }}>
 {register && <label>Nome<input name="name" required minLength={2} maxLength={100} autoComplete="name"/></label>}<label>E-mail<input name="email" type="email" required autoComplete="email"/></label><label>Senha<input name="password" type="password" required minLength={8} maxLength={72} autoComplete={register ? "new-password" : "current-password"}/></label>{error && <p className="error" role="alert">{error}</p>}<button className="primary full" disabled={busy}>{busy ? "Aguarde..." : register ? "Criar conta" : "Entrar"}</button></form>;
}
export function LogoutButton() { const router = useRouter(); return <button type="button" className="subtle danger" onClick={async () => { await client.signOut(); router.push("/login"); router.refresh(); }}>Sair</button>; }
