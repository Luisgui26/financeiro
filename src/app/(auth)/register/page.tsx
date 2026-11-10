import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default function Register() { return <main className="auth-page"><div className="auth-card"><div className="brand"><span className="brand-icon">◈</span> saldo<span>.</span></div><p className="eyebrow">COMECE POR AQUI</p><h1>Crie sua conta.</h1><p className="muted">Um lugar simples para cuidar do seu dinheiro.</p><AuthForm register/><p className="auth-link">Já tem uma conta? <Link href="/login">Entrar</Link></p></div></main>; }
