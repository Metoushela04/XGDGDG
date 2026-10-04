// Vendix - Dashboard Layout
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package, Download, Sparkles, Heart, FileText, CreditCard,
  MessageCircle, HelpCircle, Home, Bell, Menu, X, ChevronRight
} from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";


const navItems = [
  { label: "Catalogue PLR", href: "/dashboard/catalogue", icon: Package },
  { label: "Mes Téléchargements", href: "/dashboard/telechargements", icon: Download },
  { label: "Nouveautés", href: "/dashboard/nouveautes", icon: Sparkles },
  { label: "Favoris", href: "/dashboard/favoris", icon: Heart },
  { label: "Certificat", href: "/dashboard/certificat", icon: FileText },
  { label: "Abonnement", href: "/dashboard/abonnement", icon: CreditCard },
  { label: "Support", href: "/dashboard/support", icon: MessageCircle },
  { label: "Aide", href: "/dashboard/aide", icon: HelpCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-[#222222]">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-text" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link href="/dashboard" className="flex items-center gap-3">
              <img src="/logo-mark.png" alt="Vendix" className="h-6 w-auto" style={{ mixBlendMode: "screen" }} />
              <span className="font-display font-semibold hidden md:inline">Vendix</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface2 rounded-full border border-[#222222]">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium">Membre VIP</span>
            </div>
            <button className="relative p-2 text-muted hover:text-text transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>
            <Link href="/dashboard/profil" className="w-8 h-8 bg-surface2 border border-[#222222] rounded-full flex items-center justify-center text-sm font-medium hover:border-accent/50 transition-colors">
              U
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} onClick={(e) => e.stopPropagation()} className="absolute left-0 top-0 bottom-0 w-72 bg-surface border-r border-[#222222] p-6 pt-20">
              <nav className="space-y-2">
                <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${pathname === "/dashboard" ? "bg-accent/10 text-accent border border-accent/20" : "text-muted hover:text-text hover:bg-surface2"}`}>
                  <Home className="w-4 h-4" /> <span>Accueil</span>
                </Link>
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${pathname === item.href ? "bg-accent/10 text-accent border border-accent/20" : "text-muted hover:text-text hover:bg-surface2"}`}>
                    <item.icon className="w-4 h-4" /> <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t border-[#222222]"><SignOutButton /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-20 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block fixed left-0 top-20 bottom-0 w-64 bg-surface/50 border-r border-[#222222] p-4 overflow-y-auto">
          <nav className="space-y-1">
            <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${pathname === "/dashboard" ? "bg-accent/10 text-accent border border-accent/20" : "text-muted hover:text-text hover:bg-surface2"}`}>
              <Home className="w-4 h-4" /> <span>Accueil</span>
            </Link>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${pathname === item.href ? "bg-accent/10 text-accent border border-accent/20" : "text-muted hover:text-text hover:bg-surface2"}`}>
                <item.icon className="w-4 h-4" /> <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-4 pt-4 border-t border-[#222222]"><SignOutButton /></div>
        </aside>

        <main className="flex-1 md:ml-64 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
