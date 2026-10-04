// Crée (ou promeut) le compte admin initial.
// Usage : npx tsx --env-file=.env.local scripts/seed-admin.ts
// Variables requises : NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//                      SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;

if (!url || !serviceKey || !email || !password) {
  console.error("Variables manquantes (voir l'en-tête du script).");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function main() {
  let userId: string | undefined;

  const { data: created, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Administrateur" },
  });

  if (error) {
    // Compte déjà existant : on le retrouve
    const { data: list, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    if (listError) throw listError;
    userId = list.users.find((u) => u.email === email)?.id;
    if (!userId) throw error;
    console.log("Compte existant trouvé, promotion en admin…");
  } else {
    userId = created.user.id;
  }

  const { error: roleError } = await supabase.from("profiles").update({ role: "admin" }).eq("id", userId);
  if (roleError) throw roleError;

  console.log(`Admin prêt : ${email}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
