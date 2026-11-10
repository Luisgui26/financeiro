import type { Metadata } from "next";
import "./globals.css";
import { ThemeInitializer } from "@/components/theme-toggle";
export const metadata: Metadata = { title: "Saldo — suas finanças em dia", description: "Organize suas finanças pessoais com clareza." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body><ThemeInitializer/>{children}</body></html>; }
