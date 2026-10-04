// Route technique : retour de confirmation d'e-mail, de réinitialisation de mot de passe et de Google OAuth.
import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { recordSignupAcceptances } from "@/lib/legal";
import { safeNext } from "@/lib/auth/safe-next";
import { getClientIp } from "@/lib/request";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(searchParams.get("next"));
  const accepted = searchParams.get("accepted") === "1"; // case cochée sur /inscription avant Google

  const fail = (reason: string) => NextResponse.redirect(`${origin}/connexion?error=${reason}`);

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return fail("lien-invalide");
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (error) return fail("lien-invalide");
  } else {
    return fail("lien-invalide");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fail("lien-invalide");

  const { data: profile } = await supabase.from("profiles").select("is_suspended").eq("id", user.id).maybeSingle();
  if (profile?.is_suspended) {
    await supabase.auth.signOut();
    return fail("suspended");
  }

  // Google : un compte créé sans avoir coché les conditions n'est pas utilisable (PRD §14.2).
  const provider = user.app_metadata?.provider;
  if (provider && provider !== "email" && type !== "recovery") {
    const { count } = await supabase
      .from("legal_acceptances")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (!count) {
      if (accepted) {
        await recordSignupAcceptances(user.id, await getClientIp());
      } else {
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/inscription?error=conditions`);
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
