"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Check, AlertCircle, X } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

/** Notifications and action feedback inside Vendix's original header. */
export function DashboardNotifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [toast, setToast] = useState<{ message: string; error: boolean } | null>(null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard/notifications", { cache: "no-store" });
      if (!response.ok) throw new Error("Notifications indisponibles");
      const data: { notifications: Notification[]; unread: number } = await response.json();
      setNotifications(data.notifications);
      setUnread(data.unread);
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => { void refresh(); }, 0);
    const interval = window.setInterval(() => { if (!document.hidden) void refresh(); }, 30000);
    const onFocus = () => { void refresh(); };
    window.addEventListener("focus", onFocus);
    return () => { window.clearTimeout(initial); window.clearInterval(interval); window.removeEventListener("focus", onFocus); };
  }, [refresh]);

  useEffect(() => {
    const onAction = (event: Event) => {
      const detail = (event as CustomEvent<{ message: string; error?: boolean }>).detail;
      if (detail?.message) setToast({ message: detail.message, error: !!detail.error });
      void refresh();
    };
    window.addEventListener("vendix:action", onAction);
    return () => window.removeEventListener("vendix:action", onAction);
  }, [refresh]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const markRead = async (id: string) => {
    try {
      const response = await fetch("/api/dashboard/notifications", {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error();
      await refresh();
    } catch {
      setToast({ message: "Impossible de marquer cette notification comme lue.", error: true });
    }
  };

  return <>
    <div className="static sm:relative">
      <button className="relative p-2 text-muted hover:text-text transition-colors" type="button"
        aria-label={`Notifications${unread ? `, ${unread} non lues` : ""}`}
        aria-expanded={open} onClick={() => { setOpen(!open); void refresh(); }}>
        <Bell className="w-5 h-5" />
        {unread > 0 && <span className="absolute -top-1 -right-1 min-w-4 rounded-full bg-accent px-1 text-[10px] font-bold text-background">{unread > 99 ? "99+" : unread}</span>}
      </button>
      {open && <div role="region" aria-label="Notifications récentes" className="absolute left-3 right-3 top-full z-50 flex max-h-[calc(100dvh-5rem)] w-auto flex-col overflow-hidden rounded-xl border border-[#303a2c] bg-surface shadow-2xl sm:left-auto sm:right-0 sm:top-11 sm:w-[min(90vw,360px)]">
        <div className="flex shrink-0 items-center justify-between border-b border-[#222222] px-4 py-3">
          <h2 className="font-display text-sm font-semibold text-text">Notifications</h2>
          <button type="button" aria-label="Fermer les notifications" className="text-muted hover:text-text" onClick={() => setOpen(false)}><X className="w-4 h-4" /></button>
        </div>
        {loadError && <p className="p-4 text-xs text-red-400">Impossible de charger les notifications. <button type="button" onClick={() => void refresh()} className="underline">Réessayer</button></p>}
        <div className="min-h-0 overflow-y-auto">
          {!loadError && notifications.length === 0 && <p className="p-6 text-center text-sm text-muted">Aucune notification pour le moment.</p>}
          {notifications.map((n) => <div key={n.id} className={`border-b border-[#222222] p-4 text-sm ${n.is_read ? "" : "bg-accent/5"}`}>
            <div className="flex items-start justify-between gap-2"><p className="font-semibold text-text">{n.title}</p>{!n.is_read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />}</div>
            {n.body && <p className="mt-1 text-xs text-muted">{n.body}</p>}
            <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-muted">
              <time>{new Date(n.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</time>
              <div className="flex gap-3">{!n.is_read && <button type="button" className="text-accent hover:underline" onClick={() => void markRead(n.id)}>Marquer comme lu</button>}
                {n.link?.startsWith("/dashboard/") && <Link href={n.link} className="text-accent hover:underline" onClick={() => { setOpen(false); if (!n.is_read) void markRead(n.id); }}>Voir</Link>}
              </div>
            </div>
          </div>)}
        </div>
        <Link href="/dashboard/notifications" onClick={() => setOpen(false)} className="block shrink-0 p-3 text-center text-xs text-accent hover:bg-surface2">Voir toutes les notifications</Link>
      </div>}
    </div>
    {toast && <div role="status" className={`fixed bottom-4 left-4 right-4 z-[100] flex items-center gap-2 rounded-xl border bg-surface px-4 py-3 text-sm shadow-2xl sm:bottom-5 sm:left-auto sm:right-5 sm:max-w-sm ${toast.error ? "border-red-500/40 text-red-400" : "border-accent/40 text-text"}`}>
      {toast.error ? <AlertCircle className="h-4 w-4 shrink-0" /> : <Check className="h-4 w-4 shrink-0 text-accent" />}
      {toast.message}<button type="button" aria-label="Fermer" onClick={() => setToast(null)}><X className="h-4 w-4" /></button>
    </div>}
  </>;
}
