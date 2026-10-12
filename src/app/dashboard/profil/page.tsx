// Profil utilisateur connecté à Supabase (PRD §5)
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
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
    const fullName = formData.get("fullName");
    if (typeof fullName !== "string" || !fullName.trim() || fullName.trim().length > 100) {
      return { error: "Nom invalide (1 à 100 caractères)." };
    }
    const sb = await createClient();
    const { data: { user: currentUser } } = await sb.auth.getUser();
    if (!currentUser) return { error: "Session expirée. Reconnectez-vous." };

    const { error } = await sb
      .from("profiles")
      .update({ full_name: fullName.trim() })
      .eq("id", currentUser.id);

    if (error) return { error: "Mise à jour impossible. Réessayez." };
    revalidatePath("/dashboard/profil");
    return {};
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
          <ProfileForm fullName={profile?.full_name || ""} email={user.email || ""} memberSince={memberSince} save={handleUpdateProfile} />
        </div>
      </div>
    </div>
  );
}
