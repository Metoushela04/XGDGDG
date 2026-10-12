"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Search, Sparkles, Users, UserRound,
  LifeBuoy, Bell, Menu, X, ArrowUpRight, Crown, Check, AlertCircle,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";

type Notification = {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

const mainLinks = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Mes commandes", href: "/dashboard/commandes", icon: ShoppingBag },
  { label: "Espionnage", href: "/dashboard/espionnage", icon: Search },
  { label: "Nouveautés", href: "/dashboard/nouveautes", icon: Sparkles },
  { label: "Affiliation", href: "/dashboard/affiliation", icon: Users },
];
const accountLinks = [
  { label: "Mon profil", href: "/dashboard/profil", icon: UserRound },
  { label: "Support", href: "/dashboard/support", icon: LifeBuoy },
];

export function DashboardShell({ children, name, planName, periodEnd }: {
  children: React.ReactNode;
  name: string;
  planName: string | null;
  periodEnd: string | null;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [noticeError, setNoticeError] = useState(false);
  const [toast, setToast] = useState<{ message: string; error: boolean } | null>(null);

  const refreshNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/notifications", { cache: "no-store" });
      if (!res.ok) throw new Error("Notifications indisponibles");
      const payload: { notifications: Notification[]; unread: number } = await res.json();
      setNotifications(payload.notifications);
      setUnread(payload.unread);
      setNoticeError(false);
    } catch {
      setNoticeError(true);
    }
  }, []);

  useEffect(() => {
    // Initial fetch + refresh on a schedule and when returning to the browser tab.
    const initial = window.setTimeout(() => { void refreshNotifications(); }, 0);
    const interval = window.setInterval(() => { if (!document.hidden) void refreshNotifications(); }, 30000);
    const onFocus = () => { void refreshNotifications(); };
    window.addEventListener("focus", onFocus);
    return () => { window.clearTimeout(initial); window.clearInterval(interval); window.removeEventListener("focus", onFocus); };
  }, [refreshNotifications]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ message: string; error?: boolean }>).detail;
      if (detail?.message) setToast({ message: detail.message, error: !!detail.error });
      void refreshNotifications();
    };
    window.addEventListener("vendix:action", handler);
    return () => window.removeEventListener("vendix:action", handler);
  }, [refreshNotifications]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const firstName = name.trim().split(/\s+/)[0];
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");

  const markRead = async (id: string) => {
    const res = await fetch("/api/dashboard/notifications", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }),
    }).catch(() => null);
    if (res?.ok) await refreshNotifications();
    else setToast({ message: "Impossible de marquer cette notification comme lue.", error: true });
  };

  const links = (items: typeof mainLinks) => items.map(({ label, href, icon: Icon }) => {
    const active = pathname === href;
    return (
      <Link key={href} href={href} onClick={() => setMenuOpen(false)} aria-current={active ? "page" : undefined}
        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${active ? "bg-violet-500/15 border border-violet-400/30 text-white" : "text-muted hover:bg-white/5 hover:text-text"}`}>
        <Icon className={`h-[18px] w-[18px] ${active ? "text-violet-300" : ""}`} />{label}
      </Link>
    );
  });

  return (
    <div className="min-h-screen bg-background text-text">
      {menuOpen && <button className="fixed inset-0 z-40 bg-black/70 lg:hidden" aria-label="Fermer le menu" onClick={() => setMenuOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[255px] flex-col overflow-y-auto border-r border-white/10 bg-[#101016] transition-transform lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-7">
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 font-display text-xl font-bold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 font-bold text-white">V</span>Vendix
          </Link>
          <button className="lg:hidden" aria-label="Fermer le menu" onClick={() => setMenuOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <nav aria-label="Navigation membre" className="flex-1 px-4">
          <p className="px-3 pb-3 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Navigation</p>
          <div className="space-y-1">{links(mainLinks)}</div>
          <p className="px-3 pb-3 pt-9 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Compte</p>
          <div className="space-y-1">{links(accountLinks)}</div>
        </nav>
        <div className="mx-4 mb-4 mt-6 rounded-2xl border border-violet-500/25 bg-violet-500/5 p-4">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted"><span>Plan actuel</span><span className={planName ? "text-emerald-400" : "text-muted"}>● {planName ? "Actif" : "Inactif"}</span></div>
          <div className="mt-3 flex items-center gap-2 font-semibold"><Crown className="h-4 w-4 text-violet-300" />{planName || "Aucun abonnement"}</div>
          {periodEnd && <p className="mt-1 text-xs text-muted">Jusqu’au {new Date(periodEnd).toLocaleDateString("fr-FR")}</p>}
          <Link className="mt-3 inline-flex items-center gap-1 text-xs text-violet-300 hover:text-white" href="/dashboard/abonnement">Gérer mon accès <ArrowUpRight className="h-3 w-3" /></Link>
        </div>
        <div className="border-t border-white/10 px-4 py-3"><SignOutButton /></div>
      </aside>

      <div className="min-w-0 lg:pl-[255px]">
        <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-3 border-b border-white/10 bg-background/95 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <button className="lg:hidden rounded-lg p-2 hover:bg-white/5" aria-label="Ouvrir le menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu className="h-5 w-5" /></button>
            <div className="min-w-0"><p className="text-[10px] uppercase tracking-widest text-muted">Votre espace membre</p><p className="truncate font-display text-lg font-bold sm:text-xl">Bonjour, {firstName} 👋</p></div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link href="/dashboard/catalogue" className="hidden items-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-2.5 text-xs font-medium text-white hover:bg-violet-500/20 sm:flex"><ShoppingBag className="h-4 w-4" />Voir le catalogue</Link>
            <div className="relative">
              <button className="relative rounded-xl border border-white/10 p-2.5 hover:border-violet-400/50" aria-label={`Notifications${unread ? `, ${unread} non lues` : ""}`} aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen(!notificationsOpen); void refreshNotifications(); }}>
                <Bell className="h-5 w-5" />{unread > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-violet-500 px-1.5 text-[10px] font-bold text-white">{unread > 99 ? "99+" : unread}</span>}
              </button>
              {notificationsOpen && <div className="absolute right-0 top-12 z-50 w-[min(90vw,360px)] overflow-hidden rounded-2xl border border-white/10 bg-[#17171f] shadow-2xl" role="region" aria-label="Notifications récentes">
                <div className="flex items-center justify-between border-b border-white/10 p-4"><h2 className="font-semibold">Notifications</h2><button onClick={() => setNotificationsOpen(false)} aria-label="Fermer les notifications"><X className="h-4 w-4" /></button></div>
                {noticeError && <p className="p-4 text-xs text-red-300">Impossible de charger les notifications. <button className="underline" onClick={() => void refreshNotifications()}>Réessayer</button></p>}
                <div className="max-h-80 overflow-y-auto">{!noticeError && notifications.length === 0 && <p className="p-6 text-center text-sm text-muted">Aucune notification pour le moment.</p>}
                  {notifications.map((n) => <div key={n.id} className={`border-b border-white/5 p-4 text-sm ${n.is_read ? "" : "bg-violet-500/10"}`}>
                    <div className="flex items-start justify-between gap-2"><p className="font-semibold">{n.title}</p>{!n.is_read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet-400" />}</div>
                    {n.body && <p className="mt-1 text-xs text-muted">{n.body}</p>}
                    <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-muted"><time>{new Date(n.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</time><div className="flex gap-3">{!n.is_read && <button className="text-violet-300 hover:underline" onClick={() => void markRead(n.id)}>Marquer comme lu</button>}{n.link?.startsWith("/dashboard/") && <Link className="text-violet-300 hover:underline" href={n.link} onClick={() => { setNotificationsOpen(false); if (!n.is_read) void markRead(n.id); }}>Voir</Link>}</div></div>
                  </div>)}
                </div>
                <Link href="/dashboard/notifications" className="block p-3 text-center text-xs text-violet-300 hover:bg-white/5" onClick={() => setNotificationsOpen(false)}>Voir toutes les notifications</Link>
              </div>}
            </div>
            <Link href="/dashboard/profil" aria-label="Mon profil" className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/25 text-xs font-bold text-violet-200">{initials || "V"}</Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1400px] px-4 py-7 sm:px-7 lg:px-10 lg:py-9">{children}</main>
      </div>
      {toast && <div role="status" className={`fixed bottom-5 right-5 z-[100] flex max-w-sm items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-2xl ${toast.error ? "border-red-500/40 bg-[#28191e] text-red-200" : "border-emerald-500/40 bg-[#14231e] text-emerald-100"}`}>{toast.error ? <AlertCircle className="h-4 w-4 shrink-0" /> : <Check className="h-4 w-4 shrink-0" />}{toast.message}<button aria-label="Fermer" className="ml-2" onClick={() => setToast(null)}><X className="h-4 w-4" /></button></div>}
    </div>
  );
}
