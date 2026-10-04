// Next.js 16 : "proxy" remplace l'ancien "middleware".
// Il ne s'exécute QUE sur les routes qui en ont besoin, pour ne pas ralentir les pages
// publiques (priorité Mobile-First / connexions lentes).
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/connexion", "/inscription", "/mot-de-passe-oublie"],
};
