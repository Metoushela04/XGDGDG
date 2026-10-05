// Profil utilisateur connecté à Supabase (PRD §5)
import { createClient } from "@/lib/supabase/server";
import { User, Mail, Calendar, Shield, Save } from "lucide-react";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

export default async function ProfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role, created_at, avatar_url")
    .eq("id", user.id)
    .single();

  const handleUpdateProfile = async (formData: FormData) => {
    "use server";
    const fullName = formData.get("fullName") as string;
    const sb = await createClient();
    const { data: { user: currentUser } } = await sb.auth.getUser();
    if (!currentUser) return;

    await sb
      .from("profiles")
      .update({ full_name: fullName.trim() })
      .eq("id", currentUser.id);

    revalidatePath("/dashboard/profil");
  };

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">
          Mon <span className="text-accent">profil</span>
        </h1>
        <p className="text-sm text-muted">Gérez vos informations personnelles et votre compte</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {/* Carte avatar et rôle */}
        <div className="sm:col-span-1 rounded-2xl border border-[#222222] bg-surface/50 p-6 text-center space-y-4 h-fit">
          <div className="w-20 h-20 rounded-full bg-surface2 border-2 border-[#222222] flex items-center justify-center mx-auto text-accent text-2xl font-bold">
            {profile?.full_name ? profile.full_name[0].toUpperCase() : user.email?.[0].toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-base text-text">
              {profile?.full_name || "Membre Vendix"}
            </div>
            <div className="text-xs text-muted font-mono truncate">{user.email}</div>
          </div>
          <div className="pt-2">
            <span className="px-3 py-1 bg-surface2 border border-[#222222] text-xs font-semibold rounded-full text-accent">
              {profile?.role === "admin" ? "Administrateur" : "Membre VIP"}
            </span>
          </div>
        </div>

        {/* Formulaire de modification */}
        <div className="sm:col-span-2 rounded-2xl border border-[#222222] bg-surface/50 p-6 space-y-5">
          <h2 className="font-display font-semibold text-base">Informations du compte</h2>
          <form action={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-accent" /> Nom complet
              </label>
              <input
                type="text"
                name="fullName"
                defaultValue={profile?.full_name || ""}
                placeholder="Votre nom complet"
                className="w-full px-4 py-2.5 bg-surface2 border border-[#222222] rounded-xl text-sm focus:border-accent/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-accent" /> Adresse e-mail (non modifiable)
              </label>
              <input
                type="email"
                disabled
                value={user.email || ""}
                className="w-full px-4 py-2.5 bg-surface2/50 border border-[#222222] rounded-xl text-sm text-muted cursor-not-allowed font-mono text-xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs text-muted flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Membre depuis {memberSince}
              </div>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-accent text-background font-bold text-xs rounded-xl hover:bg-accent-dim transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Enregistrer</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
