// Tableau de bord administrateur (PRD §7.9, §16)
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Users, Package, Download, CreditCard, Plus, ArrowUpRight } from "lucide-react";

export const revalidate = 0; // Données temps réel

export default async function AdminDashboardPage() {
  const adminClient = createAdminClient();

  // Statistiques globales
  const [
    { count: totalUsers },
    { count: activeSubs },
    { count: totalProducts },
    { count: totalDownloads },
  ] = await Promise.all([
    adminClient.from("profiles").select("id", { count: "exact", head: true }),
    adminClient.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
    adminClient.from("products").select("id", { count: "exact", head: true }),
    adminClient.from("downloads").select("id", { count: "exact", head: true }),
  ]);

  // Derniers téléchargements
  const { data: recentDownloads } = await adminClient
    .from("downloads")
    .select(`
      id,
      downloaded_at,
      profiles:user_id (email, full_name),
      products:product_id (title)
    `)
    .order("downloaded_at", { ascending: false })
    .limit(6);

  const stats = [
    { label: "Membres inscrits", value: totalUsers || 0, icon: Users, href: "/admin/utilisateurs" },
    { label: "Abonnés VIP actifs", value: activeSubs || 0, icon: CreditCard, href: "/admin/utilisateurs" },
    { label: "Produits au catalogue", value: totalProducts || 0, icon: Package, href: "/admin/produits" },
    { label: "Téléchargements totaux", value: totalDownloads || 0, icon: Download, href: "/admin/produits" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            Tableau de bord <span className="text-accent">Admin</span>
          </h1>
          <p className="text-sm text-muted">Aperçu général de la plateforme Vendix</p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="flex items-center gap-2 px-5 py-2.5 bg-accent text-background font-bold text-sm rounded-xl hover:bg-accent-dim transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau produit PLR</span>
        </Link>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="p-5 rounded-2xl border border-[#222222] bg-surface/50 hover:border-accent/40 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-surface2 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                <stat.icon className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
            </div>
            <div className="font-display text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-xs text-muted">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Derniers téléchargements */}
      <div className="rounded-2xl border border-[#222222] bg-surface/50 p-6">
        <h2 className="font-display font-semibold text-lg mb-4">Téléchargements récents</h2>
        {!recentDownloads || recentDownloads.length === 0 ? (
          <p className="text-sm text-muted py-6 text-center">Aucun téléchargement enregistré pour le moment.</p>
        ) : (
          <div className="divide-y divide-[#222222]">
            {recentDownloads.map((dl: any) => (
              <div key={dl.id} className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <div className="font-medium text-sm text-text">
                    {dl.products?.title || "Produit supprimé"}
                  </div>
                  <div className="text-xs text-muted">
                    Par {dl.profiles?.full_name || dl.profiles?.email || "Utilisateur"}
                  </div>
                </div>
                <div className="text-xs text-muted font-mono">
                  {new Date(dl.downloaded_at).toLocaleString("fr-FR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
