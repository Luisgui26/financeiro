import { auth } from "@/auth";
import { LogoutButton } from "@/components/auth-form";
import { ThemeToggle } from "@/components/theme-toggle";
export default async function Settings() { const session = await auth(); return <><div className="topline">SUA CONTA</div><header className="page-header"><div><p className="eyebrow">PREFERÊNCIAS</p><h1>Configurações</h1><p className="muted">Informações da sua conta.</p></div></header><section className="card activity"><h2>Perfil</h2><p className="muted">{session?.user?.name}</p><p className="muted">{session?.user?.email}</p><h2> Aparência </h2><ThemeToggle/><LogoutButton/></section></>; }
