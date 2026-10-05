// Layout du panneau d'administration Vendix (PRD §7.9, §16)
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  Settings,
  ArrowLeft,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/admin/produits", label: "Produits PLR", icon: Package },
    { href: "/admin/categories", label: "Catégories", icon: FolderTree },
    { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background text-text flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-[#222222] shrink-0">
        <div className="p-6 border-b border-[#222222] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-display font-bold text-xl text-accent">Vendix</span>
            <span className="px-2 py-0.5 text-[10px] bg-accent/20 text-accent font-semibold rounded">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent text-background font-semibold"
                    : "text-muted hover:text-text hover:bg-surface2"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#222222]">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs text-muted hover:text-text hover:bg-surface2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l&apos;espace membre</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-[#222222] bg-surface">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-muted hover:text-text"
              aria-label="Menu"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <span className="font-display font-bold text-lg text-accent">Vendix Admin</span>
          </div>
          <Link href="/dashboard" className="text-xs text-muted hover:text-text">
            Quitter
          </Link>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-background/95 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <span className="font-display font-bold text-xl text-accent">Menu Admin</span>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium ${
                    pathname === item.href
                      ? "bg-accent text-background font-semibold"
                      : "text-muted hover:text-text"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="pt-4 border-t border-[#222222]">
              <Link
                href="/dashboard"
                onClick={() => setIsSidebarOpen(false)}
                className="block text-center py-3 text-sm text-muted"
              >
                Retour à l&apos;espace membre
              </Link>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
