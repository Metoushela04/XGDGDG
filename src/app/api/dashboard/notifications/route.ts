import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Non connecté" }, { status: 401 });
  const [list, unread] = await Promise.all([
    supabase.from("notifications")
      .select("id,title,body,link,is_read,created_at")
      .eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
    supabase.from("notifications").select("id", { count: "exact", head: true })
      .eq("user_id", user.id).eq("is_read", false),
  ]);
  if (list.error || unread.error) return Response.json({ error: "Notifications indisponibles" }, { status: 500 });
  return Response.json({ notifications: list.data, unread: unread.count ?? 0 }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Non connecté" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const result = z.object({ id: z.string().uuid() }).safeParse(body);
  if (!result.success) return Response.json({ error: "Notification invalide" }, { status: 400 });
  const { error } = await supabase.from("notifications").update({ is_read: true })
    .eq("id", result.data.id).eq("user_id", user.id);
  if (error) return Response.json({ error: "Mise à jour impossible" }, { status: 500 });
  return Response.json({ success: true });
}
