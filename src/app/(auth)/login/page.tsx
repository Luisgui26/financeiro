import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default function Login() { return <main className="auth-page"><div className="auth-card"><div className="brand"><span className="brand-icon">◈</span> saldo<span>.</span></div><p className="eyebrow">BEM-VINDO DE VOLTA</p><h1>Suas finanças, mais claras.</h1><p className="muted">Entre para acompanhar o que importa.</p><AuthForm/><p className="auth-link">Ainda não tem conta? <Link href="/register">Criar conta</Link></p></div></main>; }
