// Gestion des utilisateurs (PRD §7.9, §12)
import { createAdminClient } from "@/lib/supabase/admin";
import { Users, UserX, UserCheck, Shield } from "lucide-react";
import { toggleSuspendUserAction } from "@/app/admin/actions";

export const revalidate = 0;

export default async function AdminUsersPage() {
  const adminClient = createAdminClient();

  const { data: users } = await adminClient
    .from("profiles")
    .select(`
      id,
      email,
      full_name,
      role,
      is_suspended,
      created_at,
      subscriptions:subscriptions (status, current_period_end)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Membres et Abonnés</h1>
        <p className="text-sm text-muted">Gérez les comptes inscrits et l&apos;accès à la plateforme</p>
      </div>

      <div className="rounded-2xl border border-[#222222] bg-surface/50 overflow-hidden">
        {!users || users.length === 0 ? (
          <div className="p-12 text-center text-muted">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>Aucun utilisateur enregistré.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface2/60 text-xs text-muted uppercase border-b border-[#222222]">
                <tr>
                  <th className="px-6 py-4">Utilisateur</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4">Abonnement</th>
                  <th className="px-6 py-4">Statut compte</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {users.map((u: any) => {
                  const sub = Array.isArray(u.subscriptions) ? u.subscriptions[0] : u.subscriptions;
                  const isSubActive = sub?.status === "active";

                  return (
                    <tr key={u.id} className="hover:bg-surface2/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-text">{u.full_name || "Sans nom"}</div>
                        <div className="text-xs text-muted font-mono">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        {u.role === "admin" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-accent/15 text-accent text-xs font-semibold rounded-full border border-accent/30">
                            <Shield className="w-3 h-3" /> Admin
                          </span>
                        ) : (
                          <span className="text-xs text-muted">Membre</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isSubActive ? (
                          <span className="px-2.5 py-0.5 bg-green-500/10 text-green-400 text-xs font-semibold rounded-full border border-green-500/20">
                            VIP Actif
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-surface2 text-muted text-xs rounded-full">
                            Inactif
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {u.is_suspended ? (
                          <span className="px-2.5 py-0.5 bg-red-500/10 text-red-400 text-xs font-semibold rounded-full border border-red-500/20">
                            Suspendu
                          </span>
                        ) : (
                          <span className="text-xs text-muted">Actif</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.role !== "admin" && (
                          <form
                            action={async () => {
                              "use server";
                              await toggleSuspendUserAction(u.id, !u.is_suspended);
                            }}
                          >
                            <button
                              type="submit"
                              className={`p-2 rounded-lg transition-colors ${
                                u.is_suspended
                                  ? "text-green-400 hover:bg-green-500/10"
                                  : "text-red-400 hover:bg-red-500/10"
                              }`}
                              title={u.is_suspended ? "Lever la suspension" : "Suspendre le compte"}
                            >
                              {u.is_suspended ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
