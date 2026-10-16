// Vendix - Dashboard Layout
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag, Search, PackagePlus, Users,
  MessageCircle, Home, Menu, X, UserRound
} from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { DashboardNotifications } from "@/components/dashboard/DashboardNotifications";

const navItems = [
  { label: "Mes commandes", href: "/dashboard/commandes", icon: ShoppingBag },
  { label: "Espionnage", href: "/dashboard/espionnage", icon: Search },
  { label: "Nouveautés", href: "/dashboard/nouveautes", icon: PackagePlus },
  { label: "Affiliation", href: "/dashboard/affiliation", icon: Users },
  { label: "Mon profil", href: "/dashboard/profil", icon: UserRound },
  { label: "Support", href: "/dashboard/support", icon: MessageCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isNouveautes = pathname === "/dashboard/nouveautes";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  const linkClass = (href: string) => {
    const isActive = pathname === href;
    return `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
      isActive
        ? "bg-accent/10 text-accent border border-accent/20"
        : "text-muted hover:text-text hover:bg-surface2"
    }`;
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-[#222222]">
        <div className={`flex items-center justify-between px-4 py-3 ${isNouveautes ? "min-h-16 md:min-h-0" : ""}`}>
          <div className="flex items-center gap-3">
            {!isNouveautes && (
              <button
                type="button"
                className="md:hidden p-2 -ml-2 text-text hover:text-accent transition-colors"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-controls="dashboard-mobile-menu"
                aria-expanded={isSidebarOpen}
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <img src="/logo-mark.png" alt="Vendix" className="h-7 w-auto" style={{ mixBlendMode: "screen" }} />
              <span className={`font-display font-semibold ${isNouveautes ? "" : "hidden sm:inline"}`}>Vendix</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <DashboardNotifications />
            <Link
              href="/dashboard/profil"
              aria-label="Mon profil"
              className={`bg-surface2 border rounded-full flex items-center justify-center text-sm font-medium hover:border-accent/50 transition-colors ${isNouveautes ? "w-9 h-9 md:w-8 md:h-8 border-[#56634e] md:border-[#222222]" : "w-8 h-8 border-[#222222]"}`}
            >
              {isNouveautes ? <UserRound aria-hidden="true" className="h-4 w-4 md:hidden" /> : null}
              <span className={isNouveautes ? "hidden md:inline" : ""}>U</span>
            </Link>
            {isNouveautes && (
              <button
                type="button"
                className="md:hidden grid h-10 w-10 place-items-center rounded-lg border border-[#56634e] text-text transition-colors hover:border-accent/50 hover:text-accent"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-controls="dashboard-mobile-menu"
                aria-expanded={isSidebarOpen}
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={closeSidebar}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              id="dashboard-mobile-menu"
              className="fixed left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-surface border-r border-[#222222] z-50 md:hidden overflow-y-auto"
            >
              <div className="p-5 pt-5">
                <div className="flex items-center justify-between mb-6">
                  <Link href="/dashboard" className="flex items-center gap-3" onClick={closeSidebar}>
                    <img src="/logo-mark.png" alt="Vendix" className="h-7 w-auto" style={{ mixBlendMode: "screen" }} />
                    <span className="font-display font-semibold">Vendix</span>
                  </Link>
                  <button onClick={closeSidebar} className="p-2 text-muted hover:text-text">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  <Link href="/dashboard" className={linkClass("/dashboard")} onClick={closeSidebar}>
                    <Home className="w-4 h-4" /> <span>Tableau de bord</span>
                  </Link>
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className={linkClass(item.href)} onClick={closeSidebar}>
                      <item.icon className="w-4 h-4" /> <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
                <div className="mt-6 pt-4 border-t border-[#222222]">
                  <SignOutButton />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex ${isNouveautes ? "pt-16 md:pt-14" : "pt-14"}`}>
        {/* Desktop Sidebar */}
        <aside className="hidden md:block fixed left-0 top-14 bottom-0 w-64 bg-surface/50 border-r border-[#222222] overflow-y-auto">
          <nav className="p-4 space-y-1">
            <Link href="/dashboard" className={linkClass("/dashboard")}>
              <Home className="w-4 h-4" /> <span>Tableau de bord</span>
            </Link>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                <item.icon className="w-4 h-4" /> <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="px-4 pb-4 pt-2 border-t border-[#222222]">
            <SignOutButton />
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 pb-20 md:pb-8 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
