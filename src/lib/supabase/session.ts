// Logique du proxy : rafraîchit la session et protège /dashboard, /admin et les pages d'auth.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_PAGES = ["/connexion", "/inscription", "/mot-de-passe-oublie"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  // getUser() vérifie le jeton auprès de Supabase (ne jamais se fier à getSession() ici).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  // Redirection qui conserve les cookies de session éventuellement rafraîchis.
  const redirect = (to: string) => {
    const res = NextResponse.redirect(new URL(to, request.url));
    response.cookies.getAll().forEach((c) => res.cookies.set(c));
    return res;
  };

  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isProtected) {
    if (!user) {
      return redirect(`/connexion?next=${encodeURIComponent(pathname + search)}`);
    }
    if (!user.email_confirmed_at) {
      return redirect(`/verifier-email?email=${encodeURIComponent(user.email ?? "")}`);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_suspended")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.is_suspended) {
      await supabase.auth.signOut();
      return redirect("/connexion?error=suspended");
    }
    if (pathname.startsWith("/admin") && profile?.role !== "admin") {
      return redirect("/acces-refuse");
    }
  }

  // Un membre déjà connecté n'a rien à faire sur les pages de connexion / inscription.
  if (user?.email_confirmed_at && AUTH_PAGES.includes(pathname)) {
    return redirect("/dashboard");
  }

  return response;
}
