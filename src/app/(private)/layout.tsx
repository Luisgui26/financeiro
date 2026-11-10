import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/auth-form";
export const dynamic = "force-dynamic";
export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const session = await auth(); if (!session?.user?.id) redirect("/login");
  return <div className="shell"><aside className="sidebar"><Link className="brand" href="/dashboard"><span className="brand-icon">◈</span> saldo<span>.</span></Link><div className="nav-label">MENU PRINCIPAL</div><nav><Link href="/dashboard">▦ <span>Visão geral</span></Link><Link href="/transactions">⇄ <span>Movimentações</span></Link><Link href="/analytics">▥ <span>Análises</span></Link><Link href="/settings">⚙ <span>Configurações</span></Link></nav><div className="sidebar-bottom"><div className="avatar">{session.user.name?.[0]?.toUpperCase()}</div><div><strong>{session.user.name}</strong><small>Minha conta</small></div><LogoutButton/></div></aside><main className="main">{children}</main></div>;
}
